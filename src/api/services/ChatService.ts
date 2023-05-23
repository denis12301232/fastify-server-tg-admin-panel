import type { ServerTyped, SocketTyped, ChatTypes, IGroup, IUser, IMessage } from '@/types/index.js';
import type { MultipartFile } from '@fastify/multipart';
import Models from '@/models/mongo/index.js';
import { ChatDto } from '@/dto/index.js';
import { Util } from '@/util/index.js';
import { v4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import ApiError from '@/exceptions/ApiError.js';

export default class ChatService {
  static async createChat(socket: SocketTyped, userId: string, users: string[]) {
    const chat = await Models.Chat.findOneAndUpdate(
      { users: { $all: users }, type: 'dialog' },
      { $pull: { deleted: userId } },
      { _id: 1 }
    ).lean();

    let chatId = chat?._id ? String(chat?._id) : undefined;

    if (!chatId) {
      const newChat = await Models.Chat.create({ users, deleted: users.filter((user) => user !== userId) });
      chatId = String(newChat._id);
      socket.join(chatId);
    }

    const createdChat = await Models.Chat.findById(chatId)
      .populate<{ messages: IMessage[] }>({ path: 'messages' })
      .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    createdChat && socket.emit('chat:create', new ChatDto(createdChat, userId));

    return chatId;
  }

  static async createGroup(socket: SocketTyped, { title, about, users, avatar }: ChatTypes.CreateGroup) {
    let fileName;
    if (avatar) {
      const result = await fileTypeFromBuffer(avatar);
      if (!result?.mime.includes('image/')) {
        throw new Error('Wrong file type');
      }
      fileName = `${v4()}.${result.ext}`;
      await Util.createAsyncWriteStream(avatar, '../../static/images/avatars/', fileName);
    }

    const group = await Models.Group.create({
      title,
      about,
      roles: { admin: [socket.data.user?._id] },
      avatar: fileName,
    });
    const chat = await Models.Chat.create({ users, type: 'group', group: group._id });
    const createdGroup = await Models.Chat.findById(chat._id)
      .populate<{ messages: IMessage[] }>({ path: 'messages' })
      .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    createdGroup && socket.emit('chat:create-group', new ChatDto(createdGroup, socket.data.user?._id as string));
  }

  static async saveMessage(socket: SocketTyped, { text, chatId, attachments, type }: ChatTypes.Message) {
    const chat = await Models.Chat.findOne({ _id: chatId, users: { $in: [socket.data.user?._id] } });

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.type === 'group' && chat.deleted.includes(socket.data.user?._id as string)) {
      throw new Error('Forbidden');
    }

    const ids = attachments ? await this.saveAttachments(type, attachments) : [];
    const message = await Models.Message.create({
      chat_id: chatId,
      author: socket.data.user?._id,
      text,
      read: [socket.data.user?._id],
      attachments: ids,
    });

    chat.messages.push(message._id);
    chat.type === 'dialog' && (chat.deleted = []);
    await chat.save();

    const result = attachments?.length
      ? await message.populate({ path: 'attachments', select: { name: 1, type: 1 } })
      : message;

    socket.emit('chat:message', result);
    socket.to(chatId).emit('chat:message', result);
  }

  static async saveAttachments(type: 'audio' | 'image', attachments: Buffer[]) {
    const ids: string[] = [];
    let path: string;

    switch (type) {
      case 'audio':
        path = '../../static/audio/';
        break;
      case 'image':
        path = '../../static/media/';
        break;
    }

    for (const file of attachments) {
      const result = await fileTypeFromBuffer(file);
      if (type === 'audio') {
        if (result?.ext !== 'webm') {
          throw new Error('Wrong file type');
        }
      } else if (type === 'image') {
        if (!result?.mime.includes(type)) {
          throw new Error('Wrong file type');
        }
      }

      const fileName = `${v4()}.${result?.ext}`;
      const [attachment] = await Promise.allSettled([
        Models.Attachment.create({ name: fileName, ext: result?.ext, type, mime: result?.mime }),
        Util.createAsyncWriteStream(file, path, fileName),
      ]);
      if (attachment.status === 'fulfilled') {
        ids.push(attachment.value._id.toString());
      }

      return ids;
    }
  }

  static async updateUserStatus(socket: SocketTyped, user_id: string, status: 'online' | 'offline') {
    await Models.User.updateOne({ _id: user_id }, { status }).lean();
    const chats = await Models.Chat.find({ users: { $in: [user_id] } }, { messages: 0 }).lean();

    const uniqueUsers = Array.from(
      chats.reduce((unique, chat) => {
        chat.users.forEach((user) => (user.toString() !== user_id ? unique.add(user.toString()) : ''));
        return unique;
      }, new Set<string>())
    );
    socket.to(uniqueUsers).emit('chat:user-status', user_id, status);
  }

  static async getUserChatsId(user_id: string) {
    const chats = await Models.Chat.find({ users: { $in: [user_id] }, deleted: { $nin: [user_id] } }).lean();
    return chats.reduce((arr, chat) => [...arr, String(chat._id)], [] as string[]);
  }

  static async getUserChats(user_id: string) {
    const chats = await Models.Chat.find({ users: { $in: [user_id] }, deleted: { $nin: [user_id] } })
      .populate<{ messages: IMessage[] }>({
        path: 'messages',
        populate: { path: 'attachments', select: { type: 1, name: 1 } },
      })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, about: 1, _id: 1 } })
      .sort({ updatedAt: -1 })
      .lean();

    return chats.map((chat) => new ChatDto(chat, user_id));
  }

  static async openChat(user_id: string, chat_id: string, page: number, limit: number) {
    const chat = await Models.Chat.findOne({ _id: chat_id, users: { $in: [user_id] } }, { _id: 1 }).lean();
    if (!chat) {
      throw ApiError.Forbidden();
    }
    const skip = (page - 1) * limit;
    const messages = await Models.Message.find({ chat_id })
      .populate({ path: 'attachments', select: { type: 1, name: 1 } })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { messages: messages.reverse(), chat_id };
  }

  static async findUsers(loginOrName: string, user_id: string) {
    const users = await Models.User.find({
      _id: { $ne: user_id },
      $or: [{ login: { $regex: loginOrName, $options: 'i' } }, { name: { $regex: loginOrName, $options: 'i' } }],
    }).lean();
    return users;
  }

  static async addUserToGroup(io: ServerTyped, my_id: string, chat_id: string, user_id: string) {
    const chat = await Models.Chat.findById(chat_id, { _id: 1, deleted: 1, users: 1 })
      .populate<{ group: IGroup }>({ path: 'group', select: { roles: 1 } })
      .lean();

    if (!chat?.group.roles?.admin?.includes(my_id)) {
      throw ApiError.BadRequest(403, 'Not enough rights');
    }

    if (chat?.users.map((user) => user.toString()).includes(user_id) && !chat?.deleted.includes(user_id)) {
      throw ApiError.BadRequest(400, 'User already in group');
    }

    await Models.Chat.updateOne(
      { _id: chat_id },
      { $addToSet: { users: user_id }, $pull: { deleted: user_id } }
    ).lean();

    const result = await Models.Chat.findById(chat?._id)
      .populate<{ messages: IMessage[] }>({ path: 'messages' })
      .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    result && io.to(user_id).emit('chat:invite-to-group', new ChatDto(result, user_id));
    return { user: user_id };
  }

  static async removeUserFromGroup(io: ServerTyped, my_id: string, chat_id: string, user_id: string) {
    const chat = await Models.Chat.findById(chat_id, { group: 1 })
      .populate<{ group: IGroup }>({ path: 'group', select: { roles: 1 } })
      .lean();

    if (!chat?.group.roles?.admin?.includes(my_id)) {
      throw ApiError.BadRequest(403, 'Not enough rights');
    }

    const updated = await Models.Chat.updateOne({ _id: chat?._id }, { $addToSet: { deleted: user_id } }).lean();

    io.to(user_id).emit('chat:kick-from-group', chat_id);
    io.sockets.adapter.rooms.get(chat_id)?.delete(user_id);

    return updated;
  }

  static async getUsersListInChat(chat_id: string) {
    const users = await Models.Chat.findById(chat_id, { users: 1, deleted: 1, _id: 0 })
      .populate<IUser>({ path: 'users', select: { name: 1, _id: 1, login: 1, avatar: 1 } })
      .lean();
    return users?.users.filter((user) => !users.deleted.includes(user._id.toString()));
  }

  static async deleteChat(my_id: string, chat_id: string) {
    const result = await Models.Chat.updateOne({ _id: chat_id }, { $addToSet: { deleted: my_id } }).lean();
    return result;
  }

  static async updateRead(io: ServerTyped, chat_id: string, user_id: string) {
    await Models.Chat.findById(chat_id, { users: 1 }).lean();
    const updated = await Models.Message.updateMany(
      { chat_id, read: { $nin: [user_id] } },
      { $addToSet: { read: user_id } }
    ).lean();

    if (updated.modifiedCount) {
      io.to(String(chat_id)).emit('chat:read-message', chat_id, user_id);
    }
    return updated;
  }

  static async updateRolesInGroup(my_id: string, group_id: string, role: string, users: string[]) {
    const group = await Models.Group.findById(group_id).lean();

    if (!group?.roles?.admin.includes(my_id)) {
      throw ApiError.BadRequest(403, 'Not enough rights');
    }

    const updated = await Models.Group.updateOne({ _id: group_id }, { $set: { ['roles.' + role]: users } }).lean();
    return updated;
  }

  static async updateGroup(_id: string, group_id: string, data?: MultipartFile, title?: string, about?: string) {
    const group = await Models.Group.findById(group_id).lean();
    if (!group?.roles?.admin.includes(_id)) {
      throw ApiError.Forbidden();
    }
    const ext = data?.filename.split('.').at(-1);
    const fileName = ext && `${group._id}.${ext}`;
    if (fileName && data) {
      await Util.pipeStreamAsync(data.file, '../../static/images/avatars/', fileName);
    }
    await Models.Group.updateOne(
      { _id: group_id },
      { avatar: fileName, title: title || undefined, about: about || undefined }
    ).lean();
    return { avatar: fileName, title: title || undefined, about: about || undefined };
  }

  static async getUserChatById(user_id: string, chat_id: string) {
    const chat = await Models.Chat.findOne({ _id: chat_id, users: { $in: [user_id] } })
      .populate<{ messages: IMessage[] }>({
        path: 'messages',
        populate: { path: 'attachments', select: { type: 1, name: 1 } },
      })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    return chat ? new ChatDto(chat, user_id) : null;
  }
}
