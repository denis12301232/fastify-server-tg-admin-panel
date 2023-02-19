import type { SocketStream } from '@fastify/websocket'
import type { FastifyRequest } from 'fastify'
import type { WsMessage } from '@/types/interfaces'
import type { MessangerTypes } from '@/types/queries'
import type { WebSocket } from 'ws'
import { MessangerService } from '@/api/services'
import { Validate } from '@/util'
import ApiError from '@/exeptions/ApiError'



export class MessangerController {
   static async websocketConnect(connection: SocketStream, request: FastifyRequest) {
      try {
         const socket = connection.socket as unknown as WebSocket;
         socket.id = request.user._id;
         MessangerService.updateUserStatus(socket.id, 'online');

         socket.on('error', (e: any) => { throw e });
         socket.on('open', () => { });
         socket.on('close', (code, reason) => {
            console.log('close');
            MessangerService.updateUserStatus(socket.id, 'offline');
         });

         socket.on('message', async (message, isBinary) => {
            const msg: WsMessage = JSON.parse(message.toString());
            // switch (msg.event) {

            // }
         });
      } catch (e) {
         throw e;
      }
   }

   static async saveMessage(request: FastifyRequest<{ Body: MessangerTypes.SaveMessageBody }>) {
      try {
         const _id = request.user._id;
         const { chat_id, text } = request.body;
         const message = await MessangerService.saveMessage({ chat_id, text, author: _id });
         return message;
      } catch (e) {
         throw e;
      }
   }

   static async getUserChats(request: FastifyRequest) {
      try {
         const _id = request.user._id;
         const chats = await MessangerService.getUserChats(_id);
         return chats;
      } catch (e) {
         throw e;
      }
   }

   static async openChat(request: FastifyRequest<{ Querystring: MessangerTypes.OpenChatQuery }>) {
      try {
         const _id = request.user._id;
         const { chat_id, skip } = request.query;
         const messages = await MessangerService.openChat(_id, chat_id, skip);
         return messages;
      } catch (e) {
         throw e;
      }
   }

   static async findUsers(request: FastifyRequest<{ Querystring: MessangerTypes.FindUsersQuery }>) {
      const _id = request.user._id;
      const { loginOrName } = request.query;
      const users = await MessangerService.findUsers(loginOrName, _id);
      return users;
   }

   static async createChat(request: FastifyRequest<{ Body: MessangerTypes.CreateChatBody }>) {
      const _id = request.user._id;
      const { users } = request.body;
      const chat = await MessangerService.createChat(_id, users);
      return chat;
   }

   static async createGroup(request: FastifyRequest<{ Body: MessangerTypes.CreateGroupBody }>) {
      const _id = request.user._id;
      const { users, title } = request.body;
      const group = await MessangerService.createGroup(_id, users, title);
      return group;
   }

   static async addUserToGroup(request: FastifyRequest<{ Body: MessangerTypes.AddUserToGroupBody }>) {
      const _id = request.user._id;
      const { user_id, chat_id } = request.body;
      const response = await MessangerService.addUserToGroup(_id, chat_id, user_id);
      return response;
   }

   static async removeUserFromGroup(request: FastifyRequest<{ Body: MessangerTypes.RemoveUserFromGroupBody }>) {
      const _id = request.user._id;
      const { user_id, chat_id } = request.body;
      const response = await MessangerService.removeUserFromGroup(_id, chat_id, user_id);
      return response;
   }

   static async getUsersListInChat(request: FastifyRequest<{ Querystring: MessangerTypes.GetUsersListInChatQuery }>) {
      const { chat_id } = request.query;
      const response = await MessangerService.getUsersListInChat(chat_id);
      return response;
   }

   static async deleteChat(request: FastifyRequest<{ Body: MessangerTypes.DeleteChatBody }>) {
      const _id = request.user._id;
      const { chat_id } = request.body;
      const result = await MessangerService.deleteChat(_id, chat_id);
      return result;
   }

   static async updateRead(request: FastifyRequest<{ Body: MessangerTypes.UpdateReadBody }>) {
      try {
         const _id = request.user._id;
         const { chat_id } = request.body;
         const updated = await MessangerService.updateRead(chat_id, _id);
         return updated;
      } catch (e) {
         throw e;
      }
   }

   static async saveMediaMessage(request: FastifyRequest<{ Querystring: MessangerTypes.SaveMediaMessageQuery }>) {
      try {
         const _id = request.user._id;
         const { chat_id, type } = request.query;
         const data = await request.file();

         if (!data) {
            throw ApiError.BadRequest(400, 'File required');
         }

         if (type === 'image' && !Validate.isValidMime(['image/'])(data.mimetype)) {
            throw ApiError.BadRequest(400, 'Wrong mime');
         } else if (type === 'audio' && !Validate.isValidMime(['audio/ogg'])(data.mimetype)) {
            throw ApiError.BadRequest(400, 'Wrong mime');
         }

         const message = await MessangerService.saveMediaMessage(data, _id, chat_id, type);
         return message;
      } catch (e) {
         throw e;
      }

   }

   static async updateRolesInGroup(request: FastifyRequest<{ Body: MessangerTypes.UpdateRolesInGroupBody }>) {
      try {
         const _id = request.user._id;
         const { group_id, role, users } = request.body;
         const result = await MessangerService.updateRolesInGroup(_id, group_id, role, users);
         return result;
      } catch (e) {
         throw e;
      }
   }
}