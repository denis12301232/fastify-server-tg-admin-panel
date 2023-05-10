import type { MultipartFile } from '@fastify/multipart'
import type { IUser, IGroup, SocketTyped } from '@/types'
import { ChatModel, UserModel, MessageModel, GroupModel, AttachmentModel } from '@/models/mongo'
import { ChatDto } from '@/dto'
import { Util } from '@/util'
import { v4 } from 'uuid'
import { ApiError } from '@/exeptions'
import { app } from '@/main'


export default class MessangerService {
   static async getUserChats(user_id: string) {
      const chats = await ChatModel.find({ users: { $in: [user_id] }, deleted: { $nin: [user_id] } })
         .populate({ path: 'messages', populate: { path: 'attachments', select: { type: 1, name: 1 } } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, about: 1, _id: 1 } })
         .sort({ updatedAt: -1 })
         .lean();

      return chats.map(chat => new ChatDto(chat, user_id));
   }

   static async openChat(user_id: string, chat_id: string, page: number, limit: number) {
      const chat = await ChatModel.findOne({ _id: chat_id, users: { $in: [user_id] } }, { _id: 1 })
         .lean();
      if (!chat) {
         throw ApiError.Forbidden();
      }
      const skip = (page - 1) * limit;
      const messages = await MessageModel.find({ chat_id })
         .populate({ path: 'attachments', select: { type: 1, name: 1 } })
         .sort({ _id: -1 })
         .skip(skip)
         .limit(limit)
         .lean();

      return { messages: messages.reverse(), chat_id };
   }

   static async updateUserStatus(user_id: string, status: 'online' | 'offline') {
      await UserModel.updateOne({ _id: user_id }, { status })
         .lean();
      const chats = await ChatModel.find({ users: { $in: [user_id] } }, { messages: 0 })
         .lean();

      const uniqueUsers = Array.from(chats.reduce((unique, chat) => {
         chat.users.forEach((user) => user.toString() !== user_id ? unique.add(user.toString()) : '');
         return unique;
      }, new Set<string>));
      app.io.to(uniqueUsers).emit('chat:user-status', user_id, status);
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

   static async getMessagesByChatId(chat_id: string, user_id: string) {
      const messages = await MessageModel.find({ chat_id })
         .populate({ path: 'attachments', select: { type: 1, name: 1 } })
         .lean();
      await MessageModel.updateMany({ chat_id, read: { $nin: [user_id] } }, { $addToSet: { read: user_id } })
         .lean();
      return messages;
   }


   static async addUserToGroup(my_id: string, chat_id: string, user_id: string) {
      const chat = await ChatModel.findById(chat_id, { _id: 1, deleted: 1, users: 1 })
         .populate<IGroup>({ path: 'group', select: { roles: 1 } })
         .lean();

      if (!(chat?.group as any)?.roles?.admin?.includes(my_id)) {
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

      app.io.to(user_id).emit('chat:invite-to-group', new ChatDto(result, user_id));
      return { user: user_id };
   }

   static async removeUserFromGroup(my_id: string, chat_id: string, user_id: string) {
      const chat = await ChatModel.findById(chat_id, { group: 1 })
         .populate<IGroup>({ path: 'group', select: { roles: 1 } })
         .lean();

      if (!(chat?.group as any)?.roles?.admin?.includes(my_id)) {
         throw ApiError.BadRequest(403, 'Not enough rights');
      }

      const updated = await ChatModel.updateOne({ _id: chat?._id }, { $addToSet: { deleted: user_id } })
         .lean();

      app.io.to(user_id).emit('chat:kick-from-group', chat_id);
      app.io.sockets.adapter.rooms.get(chat_id)?.delete(user_id);

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
      await ChatModel.findById(chat_id, { users: 1 }).lean();
      const updated = await MessageModel.updateMany(
         { chat_id, read: { $nin: [user_id] } },
         { $addToSet: { read: user_id } }
      ).lean();

      if (updated.modifiedCount) {
         app.io.to(String(chat_id)).emit('chat:read-message', chat_id, user_id);
      }
      return updated;
   }



   static async updateRolesInGroup(my_id: string, group_id: string, role: string, users: string[]) {
      const group = await GroupModel.findById(group_id).lean();

      if (!group?.roles?.admin?.includes(my_id)) {
         throw ApiError.BadRequest(403, 'Not enough rights');
      }

      const updated = await GroupModel.updateOne({ _id: group_id }, { $set: { ["roles." + role]: users } })
         .lean();
      return updated;
   }

   static async updateGroup(_id: string, group_id: string, data?: MultipartFile, title?: string, about?: string) {
      const group = await GroupModel.findById(group_id).lean();
      if (!group?.roles.admin.includes(_id)) {
         throw ApiError.Forbidden();
      }
      const ext = data?.filename.split('.').at(-1);
      const fileName = ext && `${group._id}.${ext}`;
      if (fileName && data) {
         await Util.pipeStreamAsync(data.file, '../../static/images/avatars/', fileName);
      }
      await GroupModel.updateOne({ _id: group_id },
         { avatar: fileName, title: title || undefined, about: about || undefined })
         .lean();
      return { avatar: fileName, title: title || undefined, about: about || undefined };
   }

   static async getUserChatById(user_id: string, chat_id: string) {
      const chat = await ChatModel.findOne({ _id: chat_id, users: { $in: [user_id] } })
         .populate({ path: 'messages', populate: { path: 'attachments', select: { type: 1, name: 1 } } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
         .lean();

      return new ChatDto(chat, user_id);
   }

   static async getUserChatsId(user_id: string) {
      const chats = await ChatModel.find({ users: { $in: [user_id] }, deleted: { $nin: [user_id] } }).lean();
      return chats.reduce((arr, chat) => [...arr, String(chat._id)], [] as string[]);
   }
}
