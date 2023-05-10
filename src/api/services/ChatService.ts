import { SocketTyped, ChatTypes } from '@/types'
import { ChatModel, GroupModel, MessageModel, AttachmentModel } from '@/models/mongo'
import { ChatDto } from '@/dto'
import { Util } from '@/util'
import { v4 } from 'uuid'


export default class ChatService {
   static async createChat(socket: SocketTyped, userId: string, users: string[]) {
      const chat = await ChatModel.findOneAndUpdate(
         { users: { $all: users }, type: 'dialog' },
         { $pull: { deleted: userId } },
         { _id: 1 })
         .lean();
         
      let chatId = chat?._id ? String(chat?._id): undefined;

      if (!chatId) {
         const newChat = await ChatModel.create({ users, deleted: users.filter(user => user !== userId) });
         chatId = String(newChat._id);
         socket.join(chatId);
      }

      const createdChat = await ChatModel.findById(chatId)
         .populate({ path: 'messages' })
         .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
         .lean();

      socket.emit('chat:create', new ChatDto(createdChat, userId));
      console.log(chatId);

      return chatId;
   }

   static async createGroup(socket: SocketTyped, { title, about, users, avatar }: ChatTypes.CreateGroup) {
      let fileName;
      if (avatar) {
         const { fileTypeFromBuffer } = await import('file-type');
         const result = await fileTypeFromBuffer(avatar);
         if (!result?.mime.includes('image/')) {
            throw new Error('Wrong file type');
         }
         fileName = `${v4()}.${result.ext}`;
         await Util.createAsyncWriteStream(avatar, '../../static/images/avatars/', fileName);
      }

      const group = await GroupModel.create({
         title, about, roles: { admin: [socket.data.user?._id] }, avatar: fileName
      });
      const chat = await ChatModel.create({ users, type: 'group', group: group._id });
      const createdGroup = await ChatModel.findById(chat._id)
         .populate({ path: 'messages' })
         .populate({ path: 'messages.attachments', select: { type: 1, name: 1 } })
         .populate({ path: 'users', select: { email: 1, login: 1, name: 1, avatar: 1, status: 1 } })
         .populate({ path: 'group', select: { title: 1, avatar: 1, roles: 1, _id: 1 } })
         .lean();

      socket.emit('chat:create-group', new ChatDto(createdGroup, socket.data.user?._id!));
   }

   static async saveMessage(socket: SocketTyped, { text, chatId, attachments, type }: ChatTypes.Message) {
      const chat = await ChatModel.findOne({ _id: chatId, users: { $in: [socket.data.user?._id] } });

      if (!chat) {
         throw new Error('Chat not found');
      }

      if (chat.type === 'group' && chat.deleted.includes(socket.data.user?._id!)) {
         throw new Error('Forbidden');
      }

      const ids = attachments ? await this.saveAttachments(type, attachments) : [];
      const message = await MessageModel.create({
         chat_id: chatId, author: socket.data.user?._id, text, read: [socket.data.user?._id], attachments: ids
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
      const { fileTypeFromBuffer } = await import('file-type');
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
            AttachmentModel.create({ name: fileName, ext: result?.ext, type, mime: result?.mime }),
            Util.createAsyncWriteStream(file, path, fileName)
         ]);
         if (attachment.status === 'fulfilled') {
            ids.push(attachment.value._id.toString());
         }

         return ids;
      }
   }
}