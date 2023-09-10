import type { ChatTypes, IGroup, IUser, IMessage, IAttachment, IChat } from '@/types/index.js';
import Models from '@/models/mongo/index.js';
import { ChatDto } from '@/dto/index.js';
import { v4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import ApiError from '@/exceptions/ApiError.js';
import { MultipartFile } from '@fastify/multipart';
import { S3Service } from '@/api/services/index.js';
import { join } from 'path';
import { FilterQuery } from 'mongoose';

export default class ChatService {
  static async index(userId: string) {
    const chats = await Models.Chat.find({ users: { $in: [userId] }, deleted: { $nin: [userId] } })
      .populate<{ messages: IMessage[] }>({
        path: 'messages',
        populate: { path: 'attachments' },
      })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, about: 1, _id: 1 } })
      .sort({ updatedAt: -1 })
      .lean();

    return chats.map((chat) => new ChatDto(chat, userId));
  }

  static async show(userId: string, chatId: string) {
    const chat = await Models.Chat.findOne({ _id: chatId, users: { $in: [userId] } })
      .populate<{ messages: IMessage[] }>({ path: 'messages' })
      .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    return chat ? new ChatDto(chat, userId) : null;
  }

  static async destroy(myId: string, chatId: string) {
    const result = await Models.Chat.updateOne({ _id: chatId }, { $addToSet: { deleted: myId } }).lean();
    return result;
  }

  static async chatMessages(userId: string, chatId: string, { skip, limit }: ChatTypes.GetMessages['Querystring']) {
    const chat = await Models.Chat.findOne({ _id: chatId, users: { $in: [userId] } }, { _id: 1 }).lean();

    if (!chat) {
      throw ApiError.NotFound();
    }

    const messages = await Models.Message.find({ chatId })
      .populate<{ attachments: IAttachment[] }>({ path: 'attachments' })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return messages.reverse();
  }

  static async updateRead(chatId: string, userId: string) {
    const updated = await Models.Message.updateMany(
      { chatId, read: { $nin: [userId] } },
      { $addToSet: { read: userId } }
    ).lean();

    return updated;
  }

  static async updateGroupRoles(groupId: string, myId: string, { role, users }: ChatTypes.UpdateGroupRoles['Body']) {
    const group = await Models.Group.findById(groupId).lean();

    if (!group?.roles?.admin.includes(myId)) {
      throw ApiError.BadRequest(403, 'Not enough rights');
    }

    const updated = await Models.Group.updateOne({ _id: groupId }, { $set: { ['roles.' + role]: users } }).lean();
    return updated;
  }

  static async createChat(userId: string, users: string[]) {
    let chat = await Models.Chat.findOneAndUpdate(
      { users: { $all: users }, type: 'dialog' },
      { $pull: { deleted: userId } },
      { fields: { _id: 1 } }
    ).lean();

    if (!chat?._id) {
      chat = await Models.Chat.create({ users, deleted: users.filter((user) => user !== userId) });
    }

    const created = await Models.Chat.findById(chat._id)
      .populate<{ messages: IMessage[] }>({ path: 'messages' })
      .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    return new ChatDto(created, userId);
  }

  static async createGroup(userId: string, { title, about, users, avatar }: ChatTypes.CreateGroup) {
    let fileName: string | undefined;
    if (avatar) {
      const result = await fileTypeFromBuffer(avatar);

      if (!result?.mime.includes('image/')) {
        throw new Error('Wrong file type');
      }
      fileName = `${v4()}.${result.ext}`;
    }
    const [group] = await Promise.all(
      fileName
        ? [
            Models.Group.create({ title, about, roles: { admin: [userId] }, avatar: fileName }),
            S3Service.uploadFile(avatar, S3Service.IMAGE_FOLDER, fileName),
          ]
        : [Models.Group.create({ title, about, roles: { admin: [userId] }, avatar: fileName })]
    );

    const chat = await Models.Chat.create({ users, type: 'group', group: group._id });
    const createdGroup = await Models.Chat.findById(chat._id)
      .populate<{ messages: IMessage[] }>({ path: 'messages' })
      .populate<{ 'messages.attachments': IAttachment[] }>({
        path: 'messages.attachments',
        select: { type: 1, name: 1 },
      })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    return new ChatDto(createdGroup, userId);
  }

  static async saveMessage(userId: string, { text, chatId, attachments }: ChatTypes.Message) {
    const chat = await Models.Chat.findOne({ _id: chatId, users: { $in: [userId] } });

    if (!chat) {
      throw new Error('Chat not found');
    }

    if (chat.type === 'group' && chat.deleted.includes(userId)) {
      throw new Error('Forbidden');
    }

    const ids = attachments ? await ChatService.saveAttachmentsToS3(attachments) : [];
    const message = await Models.Message.create({
      chatId: chatId,
      author: userId,
      text,
      read: [userId],
      attachments: ids,
    });

    const usersToJoin = chat.deleted;
    chat.messages.push(message._id);
    chat.type === 'dialog' && (chat.deleted = []);

    const [result] = await Promise.all([message.populate({ path: 'attachments' }), chat.save()]);

    return { message: result, usersToJoin };
  }

  static async saveAttachmentsToS3(attachments: Buffer[]) {
    const validMimes = ['image/', 'audio/', 'video/'];
    const ids: string[] = [];
    for (const attachment of attachments) {
      const validateResult = await fileTypeFromBuffer(attachment);
      const fileName = v4();
      let valid = false;

      for (const mime of validMimes) {
        if (validateResult?.mime.includes(mime)) {
          valid = true;
          break;
        }
      }

      if (!valid) {
        throw ApiError.BadRequest(400, 'Wrong file type');
      }
      const [newAttachment] = await Promise.all([
        Models.Attachment.create({ name: fileName, ext: validateResult?.ext, mime: validateResult?.mime }),
        S3Service.uploadFile(attachment, S3Service.MEDIA_FOLDER, `${fileName}.${validateResult?.ext}`),
      ]);

      ids.push(newAttachment._id.toString());
    }

    return ids;
  }

  static async updateUserStatus(userId: string, status: 'online' | 'offline') {
    await Models.User.updateOne({ _id: userId }, { status }).lean();
    const chats = await Models.Chat.find({ users: { $in: [userId] } }, { messages: 0 }).lean();

    const uniqueUsers = Array.from(
      chats.reduce((unique, chat) => {
        chat.users.forEach((user) => (user.toString() !== userId ? unique.add(user.toString()) : ''));
        return unique;
      }, new Set<string>())
    );
    return uniqueUsers;
  }

  static async getUserChatsId(userId: string) {
    const chats = await Models.Chat.find({ users: { $in: [userId] }, deleted: { $nin: [userId] } }).lean();
    return chats.reduce((arr, chat) => [...arr, String(chat._id)], [] as string[]);
  }

  static async updateGroupMembers(
    chatId: string,
    myId: string,
    { userId, action }: ChatTypes.UpdateGroupMembers['Body']
  ) {
    const chat = await Models.Chat.findById(chatId, { deleted: 1, users: 1 })
      .populate<{ group: IGroup }>({ path: 'group', select: { roles: 1 } })
      .lean();

    if (!chat?.group.roles?.admin?.includes(myId)) {
      throw ApiError.BadRequest(403, 'Not enough rights');
    }

    const query: FilterQuery<IChat> =
      action === 'add' ? { $addToSet: { users: userId } } : { $pull: { users: userId } };

    const updated = await Models.Chat.updateOne({ _id: chatId }, query);

    if (!updated.modifiedCount) {
      throw ApiError.BadRequest();
    }

    const result = await Models.Chat.findById(chatId)
      .populate<{ messages: IMessage[] }>({ path: 'messages' })
      .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
      .populate<{ users: IUser[] }>({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
      .populate<{ group: IGroup }>({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
      .lean();

    return new ChatDto(result, userId);
  }

  static async getUsersListInChat(chatId: string) {
    const users = await Models.Chat.findById(chatId, { users: 1, deleted: 1, _id: 0 })
      .populate<IUser>({ path: 'users', select: { name: 1, _id: 1, login: 1, avatar: 1 } })
      .lean();
    return users?.users.filter((user) => !users.deleted.includes(user._id.toString()));
  }

  static async updateGroup(
    groupId: string,
    userId: string,
    info: ChatTypes.UpdateGroup['Querystring'],
    file?: MultipartFile
  ) {
    const group = await Models.Group.findById(groupId).lean();

    if (!group?.roles.admin?.includes(userId)) {
      throw ApiError.Forbidden();
    }

    if (file) {
      const buffer = await file.toBuffer();

      if (!buffer) {
        throw ApiError.BadRequest(400, 'File required');
      }

      const validateResult = await fileTypeFromBuffer(buffer);

      if (!validateResult?.mime.includes('image/')) {
        throw ApiError.BadRequest(400, 'Wrong file type');
      }
      const ext = file.filename.split('.').at(-1);
      const fileName = `${v4()}.${ext}`;

      const [oldGroup, newGroup] = await Promise.all([
        Models.Group.findOne({ _id: groupId }, { avatar: 1 }).lean(),
        Models.Group.findOneAndUpdate(
          { _id: groupId },
          { avatar: fileName, title: info.title, about: info.about },
          { new: true }
        ).lean(),
        S3Service.uploadFile(buffer, S3Service.IMAGE_FOLDER, fileName),
      ]);

      if (oldGroup?.avatar) {
        const oldFile = oldGroup.avatar.split('/').at(-1) || '';
        S3Service.deleteFiles([{ Key: join(S3Service.IMAGE_FOLDER, oldFile) }]).catch((e) => console.log(e));
      }

      return newGroup;
    } else {
      const group = await Models.Group.findOneAndUpdate(
        { _id: groupId },
        { title: info.title, about: info.about },
        { new: true }
      ).lean();

      return group;
    }
  }

  static async deleteMessages(userId: string, { chatId, msgIds }: ChatTypes.DeleteMessages) {
    const chat = await Models.Chat.findOne({ _id: chatId, users: { $in: [userId] } }).lean();

    if (!chat) {
      throw ApiError.BadRequest();
    }

    return Models.Message.deleteMany({ chatId: chatId, _id: { $in: msgIds } }).lean();
  }

  static async messageReaction(userId: string, { msgId, reaction }: ChatTypes.MessageReaction) {
    const message = await Models.Message.findById(msgId);

    if (!message) {
      throw ApiError.BadRequest();
    }

    for (const [rc, users] of message.reactions.entries()) {
      if (rc === reaction) {
        continue;
      }
      const filtered = users.filter((id) => id !== userId);
      message.reactions.set(rc, filtered);
    }
    if (message?.reactions.get(reaction)?.includes(userId)) {
      const filtered = message.reactions.get(reaction)?.filter((id) => userId != id);
      message.reactions.set(reaction, filtered || []);
    } else {
      message.reactions.set(reaction, [...(message.reactions.get(reaction) || []), userId]);
    }
    await message.save();

    return { reactions: message.reactions, chatId: message.chatId.toString() };
  }
}
