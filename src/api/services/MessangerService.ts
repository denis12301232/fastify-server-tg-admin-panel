import type { MultipartFile } from '@fastify/multipart'
import type { IUser, IGroup } from '@/types/interfaces'
import { ChatModel, UserModel, MessageModel, GroupModel, AttachmentModel } from '@/models/mongo'
import { WsMessageDto, ChatDto } from '@/dto'
import { WsService } from '@/api/services'
import { Types } from 'mongoose'
import { Util } from '@/util'
import { v4 } from 'uuid'
import ApiError from '@/exeptions/ApiError'


export class MessangerService {
   static async saveMessage({ chat_id, author, text, attachments }: { chat_id: string, author: string, text?: string, attachments?: string[] }) {
      const chat = await ChatModel.findOne({
         _id: chat_id,
         users: { $in: [author] },
      });

      if (!chat) {
         throw ApiError.BadRequest(400, 'Chat not found');
      }

      if (chat.type === 'group' && chat.deleted.includes(author)) {
         throw ApiError.BadRequest(400, 'Not in chat');
      }

      const message = await MessageModel.create({
         chat_id, author, text, read: [author], attachments
      });

      chat.messages.push(message._id);
      chat.type === 'dialog' ? chat.deleted = [] : '';
      await chat.save();

      const result = attachments?.length
         ? await message.populate({ path: 'attachments', select: { name: 1, type: 1 } })
         : message;

      const msgToSend = new WsMessageDto({ event: 'message', payload: { message: result } });
      WsService.broadcastMessage(msgToSend, chat.users
         .map(user => user.toString())
         .filter(user => user !== author && !chat.deleted.includes(user)));

      return result;
   }

   static async getUserChats(user_id: string) {
      const chats = await ChatModel.find({
         users: { $in: [user_id] },
         deleted: { $nin: [user_id] },
      })
         .populate({ path: 'messages' })
         .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
         .sort({ updatedAt: -1 })
         .lean();

      return chats.map(chat => new ChatDto(chat, user_id));
   }

   static async openChat(user_id: string, chat_id: string, skip: number) {
      const chat = await ChatModel.findById(chat_id, { users: 1 })
         .lean();
      const messages = await MessageModel.find({ chat_id })
         .sort({ _id: -1 })
         .skip(skip ? skip : 0)
         .populate({ path: 'attachments', select: { type: 1, name: 1 } })
         .lean();
      const updated = await MessageModel.updateMany(
         { chat_id, read: { $nin: [user_id] } },
         { $addToSet: { read: user_id } }
      ).lean();

      if (updated.modifiedCount) {
         const updateToSend = new WsMessageDto({ event: 'read', payload: { chat_id, user_id } });
         WsService.broadcastMessage(updateToSend, chat?.users.map(user => user.toString())
            .filter(user => user !== user_id) || []);
      }

      return { messages: messages.reverse(), chat_id };
   }

   static async updateUserStatus(user_id: string, status: 'online' | 'offline') {
      await UserModel.updateOne({ _id: user_id }, { status })
         .lean();
      const chats = await ChatModel.find({ users: { $in: [new Types.ObjectId(user_id)] } }, { messages: 0 })
         .lean();

      const uniqueUsers = Array.from(chats.reduce((unique, chat) => {
         chat.users.forEach((user) => user.toString() !== user_id ? unique.add(user.toString()) : '');
         return unique;
      }, new Set<string>));

      const msgToSend = new WsMessageDto({ event: 'update_status', payload: { user_id, status } });
      WsService.broadcastMessage(msgToSend, uniqueUsers);
   }

   static async findUsers(loginOrName: string, user_id: string) {
      const users = await UserModel.find({
         _id: { $ne: user_id },
         $or: [
            { login: { $regex: loginOrName, $options: 'i' } },
            { name: { $regex: loginOrName, $options: 'i' } },
         ]
      }).lean();
      return users;
   }

   static async createChat(user_id: string, users: string[]) {
      const chat = await ChatModel.findOneAndUpdate(
         { users: { $all: users }, type: 'dialog' },
         { $pull: { deleted: user_id } },
         { _id: 1 }
      ).lean();

      let chat_id = chat?._id;

      if (!chat_id) {
         const newChat = await ChatModel.create({ users, deleted: users.filter(user => user !== user_id) });
         chat_id = newChat._id;
      }

      const createdChat = await ChatModel.findById(chat_id)
         .populate({ path: 'messages' })
         .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
         .lean();

      return new ChatDto(createdChat, user_id);
   }

   static async getMessagesByChatId(chat_id: string, user_id: string) {
      const messages = await MessageModel.find({ chat_id })
         .populate({ path: 'attachments', select: { type: 1, name: 1 } })
         .lean();
      await MessageModel.updateMany({ chat_id, read: { $nin: [user_id] } }, { $addToSet: { read: user_id } })
         .lean();
      return messages;
   }

   static async createGroup(user_id: string, users: string[], title: string) {
      const group = await GroupModel.create({ title, roles: { creator: [user_id], admin: [user_id] } });
      const chat = await ChatModel.create({ users, type: 'group', group: group._id });
      const createdGroup = await ChatModel.findById(chat._id)
         .populate({ path: 'messages' })
         .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
         .lean();

      return new ChatDto(createdGroup, user_id);
   }

   static async addUserToGroup(my_id: string, chat_id: string, user_id: string) {
      const chat = await ChatModel.findById(chat_id, { _id: 1, deleted: 1, users: 1 })
         .populate<IGroup>({ path: 'group', select: { roles: 1 } })
         .lean();

      if (!(chat?.group as any)?.roles?.creator?.includes(my_id) && !(chat?.group as any)?.roles?.admin?.includes(my_id)) {
         throw ApiError.BadRequest(403, 'Not enough rights');
      }

      if (chat?.users.map(user => user.toString()).includes(user_id) && !chat?.deleted.includes(user_id)) {
         throw ApiError.BadRequest(400, 'User already in group');
      }

      await ChatModel.updateOne({ _id: chat_id },
         { $addToSet: { users: user_id }, $pull: { deleted: user_id } }
      ).lean();

      const result = await ChatModel.findById(chat?._id)
         .populate({ path: 'messages' })
         .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
         .lean();

      const msgToSend = new WsMessageDto({ event: 'invite_to_group', payload: new ChatDto(result, user_id) });
      WsService.sendMessage(msgToSend, user_id);

      return { user: user_id };
   }

   static async removeUserFromGroup(my_id: string, chat_id: string, user_id: string) {
      const chat = await ChatModel.findById(chat_id, { group: 1 })
         .populate<IGroup>({ path: 'group', select: { roles: 1 } })
         .lean();

      if (!(chat?.group as any)?.roles?.creator?.includes(my_id) && !(chat?.group as any)?.roles?.admin?.includes(my_id)) {
         throw ApiError.BadRequest(403, 'Not enough rights');
      }

      const updated = await ChatModel.updateOne({ _id: chat?._id }, { $addToSet: { deleted: user_id } })
         .lean();
      const msgToSend = new WsMessageDto({ event: 'kick_from_group', payload: { chat_id } });
      WsService.sendMessage(msgToSend, user_id);

      return updated;
   }

   static async getUsersListInChat(chat_id: string) {
      const users = await ChatModel.findById(chat_id, { users: 1, deleted: 1, _id: 0 })
         .populate<IUser>({ path: 'users', select: { name: 1, _id: 1, login: 1, avatar: 1 } })
         .lean();
      return users?.users.filter(user => !users.deleted.includes(user._id.toString()));
   }

   static async deleteChat(my_id: string, chat_id: string) {
      const result = await ChatModel.updateOne({ _id: chat_id }, { $addToSet: { deleted: my_id } })
         .lean();
      return result;
   }

   static async updateRead(chat_id: string, user_id: string) {
      const chat = await ChatModel.findById(chat_id, { users: 1 })
         .lean();
      const updated = await MessageModel.updateMany(
         { chat_id, read: { $nin: [user_id] } },
         { $addToSet: { read: user_id } }
      ).lean();

      if (updated.modifiedCount) {
         const updateToSend = new WsMessageDto({ event: 'read', payload: { chat_id, user_id } });
         WsService.broadcastMessage(updateToSend, chat?.users.map(user => user.toString())
            .filter(user => user !== user_id) || []);
      }

      return updated;
   }

   static async saveMediaMessage(data: MultipartFile, user_id: string, chat_id: string, type: 'audio' | 'image') {
      const ext = data.filename.split('.').reverse()[0];
      const fileName = v4() + '.' + ext;
      const buffer = await data.toBuffer();
      const path = type === 'audio' ? '../../static/audio/' : '../../static/media/';
      await Util.createAsyncWriteStream(buffer, path, fileName);

      const attachment = await AttachmentModel.create({ name: fileName, ext, type, mime: data.mimetype });
      const message = await this.saveMessage({ chat_id, author: user_id, attachments: [attachment._id.toString()] });
      return message;
   }

   static async updateRolesInGroup(my_id: string, group_id: string, role: string, users: string[]) {
      const group = await GroupModel.findById(group_id).lean();

      if (!group?.roles?.creator?.includes(my_id) && !group?.roles?.admin?.includes(my_id)) {
         throw ApiError.BadRequest(403, 'Not enough rights');
      }

      const updated = await GroupModel.updateOne({ _id: group_id }, { $set: { ["roles." + role]: users } })
         .lean();
      return updated;
   }
}
