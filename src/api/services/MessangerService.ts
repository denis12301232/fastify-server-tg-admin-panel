import type { MultipartFile } from '@fastify/multipart'
import type { IUser, IMessage, IGroup } from '@/types/interfaces'
import { ChatModel, UserModel, MessageModel, GroupModel, AttachmentModel } from '@/models/mongo'
import { WsMessageDto } from '@/dto'
import { WsService } from '@/api/services'
import { Types } from 'mongoose'
import ApiError from '@/exeptions/ApiError'
import { Util } from '@/util'
import { v4 } from 'uuid'


export class MessangerService {
   static async saveMessage({ chat_id, author, text, attachments }: { chat_id: string, author: string, text?: string, attachments?: string[] }) {
      const message = await MessageModel.create({
         chat_id, author, text, read: [author], attachments
      });
      const chat = await ChatModel.findOneAndUpdate({ _id: chat_id }, {
         $addToSet: { messages: message._id.toString() },
         deleted: []
      }).lean();

      const result = attachments?.length
         ? await message.populate({ path: 'attachments', select: { name: 1, type: 1 } })
         : message;

      const msgToSend = new WsMessageDto({ event: 'message', payload: { message: result } });
      WsService.broadcastMessage(msgToSend, chat ? chat.users
         .map(user => user.toString())
         .filter(user => user !== author) : []);

      return result;
   }

   static async getUserChats(user_id: string) {
      const chats = await ChatModel.aggregate([
         { $match: { users: { $in: [new Types.ObjectId(user_id)] }, type: 'dialog', deleted: { $nin: [user_id] } } },
         {
            $lookup: {
               from: 'messages',
               localField: 'messages',
               foreignField: '_id',
               as: "messages",
               pipeline: [{
                  $lookup: {
                     from: 'attachments',
                     localField: 'attachments',
                     foreignField: '_id',
                     pipeline: [{ $project: { type: 1, name: 1 } }],
                     as: 'attachments'
                  }
               }]
            }
         },
         {
            $project: {
               messages: { $slice: ['$messages', -1] },
               users: 1,
               updatedAt: 1,
               createdAt: 1,
               type: 1,
               total: { $size: "$messages" },
               companion: {
                  $first: {
                     $filter: {
                        input: '$users', as: 'user', cond: {
                           $ne: ['$$user', new Types.ObjectId(user_id)]
                        }
                     }
                  }
               },
               unread: {
                  $sum: {
                     $size: {
                        $filter: {
                           input: '$messages.read', as: 'count', cond: {
                              $not: { $in: [new Types.ObjectId(user_id), '$$count'] }
                           }
                        }
                     }
                  }
               },
            }
         },
         {
            $lookup: {
               from: 'users',
               localField: 'companion',
               foreignField: '_id',
               pipeline: [{ $project: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } }],
               as: 'companion'
            }
         },

         { $unwind: '$companion' },
         { $sort: { updatedAt: -1 } }
      ]);

      const groups = await ChatModel.aggregate([
         { $match: { users: { $in: [new Types.ObjectId(user_id)] }, type: 'group', deleted: { $nin: [user_id] } } },
         {
            $lookup: {
               from: 'messages',
               localField: 'messages',
               foreignField: '_id',
               as: "messages",
               pipeline: [{
                  $lookup: {
                     from: 'attachments',
                     localField: 'attachments',
                     foreignField: '_id',
                     pipeline: [{ $project: { type: 1, name: 1 } }],
                     as: 'attachments'
                  }
               }]
            }
         },
         {
            $project: {
               messages: { $slice: ['$messages', -1] },
               users: 1,
               updatedAt: 1,
               createdAt: 1,
               type: 1,
               group: 1,
               total: { $size: "$messages" },
               unread: {
                  $sum: {
                     $size: {
                        $filter: {
                           input: '$messages.read', as: 'count', cond: {
                              $not: { $in: [new Types.ObjectId(user_id), '$$count'] }
                           }
                        }
                     }
                  }
               },
            }
         },
         { $lookup: { from: 'users', localField: 'users', foreignField: '_id', as: 'users' } },
         { $lookup: { from: 'groups', localField: 'group', foreignField: '_id', as: 'group' } },

         { $unwind: '$group' },
      ]);

      const result = chats.concat(groups).sort((a, b) => {
         return new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1;
      });

      return result;
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
      console.log(messages);

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
            { login: { $regex: loginOrName, $options: 'gi' } },
            { name: { $regex: loginOrName, $options: 'gi' } },
         ]
      });
      return users;
   }

   static async createChat(user_id: string, users: string[]) {
      const chat = await ChatModel.findOne({ users: { $all: users } })
         .lean();

      if (!chat) {
         const newChat = await ChatModel.create({ users });
         const chat = await ChatModel.aggregate([
            { $match: { _id: newChat._id } },
            {
               $project: {
                  messages: { $slice: ['$messages', -1] },
                  users: 1,
                  updatedAt: 1,
                  createdAt: 1,
                  total: { $size: "$messages" },
                  unread: { $size: "$messages" },
                  companion: {
                     $first: {
                        $filter: {
                           input: '$users', as: 'user', cond: {
                              $ne: ['$$user', new Types.ObjectId(user_id)]
                           }
                        }
                     }
                  },
               }
            },
            {
               $lookup: {
                  from: 'users',
                  localField: 'companion',
                  foreignField: '_id',
                  pipeline: [{ $project: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } }],
                  as: 'companion'
               }
            },
            { $unwind: '$companion' }
         ])
         return chat.at(0);
      }
      return chat;
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
      const group = await GroupModel.create({ title, roles: { creator: [user_id] } });
      const chat = await ChatModel.create({ users, type: 'group', group: group._id });
      const newGroup = await ChatModel.aggregate([
         { $match: { _id: chat._id } },
         {
            $project: {
               users: 1, updatedAt: 1, createdAt: 1, group: 1,
               messages: { $slice: ['$messages', -1] },
               total: { $size: "$messages" },
               unread: { $size: "$messages" },
            }
         },
         { $lookup: { from: 'groups', localField: 'group', foreignField: '_id', as: 'group' } },
         { $unwind: '$group' },
      ]);

      return newGroup.at(0);
   }

   static async addUserToGroup(my_id: string, chat_id: string, user_id: string) {
      const chat = await ChatModel.findById(chat_id).populate<IGroup>('group');

      if (!(chat?.group as any)?.roles.get('creator')?.includes(my_id)
         && !(chat?.group as any)?.roles.get('admin')?.includes(my_id)
      ) {
         throw ApiError.BadRequest(403, 'Not enough rights');
      }

      const newGroup = await ChatModel.findOneAndUpdate(
         { _id: chat_id, users: { $nin: [user_id] } },
         { $addToSet: { users: user_id } },
         {
            users: 1, updatedAt: 1, createdAt: 1, group: 1,
            messages: { $slice: ['$messages', -1] },
            total: { $size: "$messages" },
         })
         .populate<IMessage>('messages')
         .populate('messages.attachments')
         .populate<IGroup>('group')
         .lean();

      if (!newGroup) {
         throw ApiError.BadRequest(400, 'User already in group');
      }

      const msgToSend = new WsMessageDto({ event: 'invite_to_group', payload: newGroup });
      WsService.broadcastMessage(msgToSend, [user_id]);

      return { message: 'Success' }
   }

   static async removeUserFromGroup(my_id: string, chat_id: string, user_id: string) {
      const chat = await ChatModel.findById(chat_id).populate<IGroup>('group');

      if (!(chat?.group as any)?.roles.get('creator')?.includes(my_id)
         && !(chat?.group as any)?.roles.get('admin')?.includes(my_id)
      ) {
         throw ApiError.BadRequest(403, 'Not enough rights');
      }

      const updated = await ChatModel.updateOne(
         { _id: chat_id },
         { $pull: { users:  user_id } }
      ).lean();
      return updated;
   }

   static async getUsersListInChat(chat_id: string) {
      const users = await ChatModel.findById(chat_id, { users: 1, _id: 0 })
         .populate<IUser>({ path: 'users', select: { name: 1, _id: 1, login: 1, avatar: 1 } })
         .lean();
      return users?.users;
   }

   static async leaveGroup(my_id: string, chat_id: string) {
      const result = await ChatModel.updateOne({ _id: chat_id, type: 'group' }, { $pull: { users: my_id } })
         .lean();
      return result;
   }

   static async deleteChat(my_id: string, chat_id: string) {
      const result = await ChatModel.updateOne({ _id: chat_id }, { $addToSet: { deleted: my_id } })
         .lean();
      return result;
   }

   static async saveAudioMessage(data: MultipartFile, user_id: string, chat_id: string) {
      const ext = data.filename.split('.').reverse()[0];
      const fileName = v4() + '.' + ext;
      const buffer = await data.toBuffer();
      await Util.createAsyncWriteStream(buffer, '../../static/audio/' + fileName);

      const attachment = await AttachmentModel.create({ name: fileName, ext, type: 'audio', mime: data.mimetype });
      const message = await this.saveMessage({ chat_id, author: user_id, attachments: [attachment._id.toString()] });

      return message;
   }
}
