import type { FastifyRequest, FastifyInstance } from 'fastify';
import type { ChatTypes } from '@/types/index.js';
import { ChatService } from '@/api/services/index.js';
import ApiError from '@/exceptions/ApiError.js';
import { fileTypeFromBuffer } from 'file-type';

export default class MessangerController {
  static async getUserChats(request: FastifyRequest) {
    const _id = request.user._id;
    const chats = await ChatService.getUserChats(_id);
    return chats;
  }

  static async openChat(request: FastifyRequest<ChatTypes.OpenChat>) {
    const _id = request.user._id;
    const { chat_id, page, limit } = request.query;
    const messages = await ChatService.openChat(_id, chat_id, page, limit);
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
    const { group_id, title, about } = request.query;
    const file = await request.file({ limits: { fileSize: 2048e3, fieldSize: 2048e3 } });
    const buffer = await file?.toBuffer();

    if (buffer) {
      const validateResult = await fileTypeFromBuffer(buffer);

      if (!validateResult?.mime.includes('image/')) {
        throw ApiError.BadRequest(400, 'Wrong file type');
      }
    }

    const result = await ChatService.updateGroup(_id, group_id, {
      title,
      about,
      file: { buffer, ext: file?.filename.split('.').at(-1) },
    });
    return result;
  }

  static async getUserChatById(request: FastifyRequest<ChatTypes.GetUserChatById>) {
    const _id = request.user._id;
    const { chat_id } = request.query;
    const chat = await ChatService.getUserChatById(_id, chat_id);
    return chat;
  }
}
