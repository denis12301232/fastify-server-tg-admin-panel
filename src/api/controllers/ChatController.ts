import type { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';
import type { ChatTypes } from '@/types/index.js';
import { ChatService, S3Service } from '@/api/services/index.js';

export default class MessangerController {
  static async getUserChats(request: FastifyRequest) {
    const _id = request.user._id;
    const chats = await ChatService.getUserChats(_id);
    return chats;
  }

  static async getChatMessages(request: FastifyRequest<ChatTypes.GetChatMessages>) {
    const _id = request.user._id;
    const messages = await ChatService.getChatMessages(_id, request.query);
    return messages;
  }

  static async findUsers(request: FastifyRequest<ChatTypes.FindUsers>) {
    const _id = request.user._id;
    const { loginOrName } = request.query;
    const users = await ChatService.findUsers(loginOrName, _id);
    return users;
  }

  static async addUserToGroup(this: FastifyInstance, request: FastifyRequest<ChatTypes.AddUserToGroup>) {
    const _id = request.user._id;
    const { user_id, chat_id } = request.body;
    const response = await ChatService.addUserToGroup(this.io, _id, chat_id, user_id);
    return response;
  }

  static async removeUserFromGroup(this: FastifyInstance, request: FastifyRequest<ChatTypes.RemoveUserFromGroup>) {
    const _id = request.user._id;
    const { user_id, chat_id } = request.body;
    const response = await ChatService.removeUserFromGroup(this.io, _id, chat_id, user_id);
    return response;
  }

  static async getUsersListInChat(request: FastifyRequest<ChatTypes.GetUsersListInChat>) {
    const { chat_id } = request.query;
    const response = await ChatService.getUsersListInChat(chat_id);
    return response;
  }

  static async deleteChat(request: FastifyRequest<ChatTypes.DeleteChat>) {
    const _id = request.user._id;
    const { chat_id } = request.body;
    const result = await ChatService.deleteChat(_id, chat_id);
    return result;
  }

  static async updateRead(this: FastifyInstance, request: FastifyRequest<ChatTypes.UpdateRead>) {
    const _id = request.user._id;
    const { chat_id } = request.body;
    const updated = await ChatService.updateRead(this.io, chat_id, _id);
    return updated;
  }

  static async updateRolesInGroup(request: FastifyRequest<ChatTypes.UpdateRolesInGroup>) {
    const _id = request.user._id;
    const { group_id, role, users } = request.body;
    const result = await ChatService.updateRolesInGroup(_id, group_id, role, users);
    return result;
  }

  static async updateGroup(request: FastifyRequest<ChatTypes.UpdateGroup>) {
    const _id = request.user._id;
    const file = await request.file();
    const result = await ChatService.updateGroup(_id, request.query, file);
    return result;
  }

  static async getUserChatById(request: FastifyRequest<ChatTypes.GetUserChatById>) {
    const _id = request.user._id;
    const { chat_id } = request.query;
    const chat = await ChatService.getUserChatById(_id, chat_id);
    return chat;
  }

  static async getFileFromS3(request: FastifyRequest<ChatTypes.GetFileFromS3>, reply: FastifyReply) {
    const result = await S3Service.getFile(S3Service.MEDIA_FOLDER, request.query.filename);
    const stream = result.Body;
    return reply.header('Content-Type', 'application/octet-stream').send(stream);
  }
}
