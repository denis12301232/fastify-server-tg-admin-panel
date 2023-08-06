import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { ToolsTypes } from '@/types/index.js';
import { ToolsService } from '@/api/services/index.js';
import ApiError from '@/exceptions/ApiError.js';

export default class ToolsController {
  static async setNewName(request: FastifyRequest<ToolsTypes.SetNewName>) {
    const _id = request.user._id;
    const { name } = request.body;
    const user = await ToolsService.setNewName(_id, name);
    return user;
  }

  static async setNewEmail(request: FastifyRequest<ToolsTypes.SetNewEmail>) {
    const _id = request.user._id;
    const { email } = request.body;
    const user = await ToolsService.setNewEmail(_id, email);
    return user;
  }

  static async setNewPassword(request: FastifyRequest<ToolsTypes.SetNewPassword>) {
    const _id = request.user._id;
    const { newPassword, oldPassword } = request.body;
    const user = await ToolsService.setNewPassword(_id, newPassword, oldPassword);
    return user;
  }

  static async setGoogleServiceAccountSettings(request: FastifyRequest<ToolsTypes.SetGoogleServiceAccountSettings>) {
    await ToolsService.setGoogleServiceAccountSettings(request.body);
    return { message: 'Saved' };
  }

  static async getUsers(request: FastifyRequest<ToolsTypes.GetUsers>, reply: FastifyReply) {
    const _id = request.user._id;
    const { limit, page, filter } = request.query;
    const { users, count } = await ToolsService.getUsers(_id, limit, page, filter);
    reply.header('X-Total-Count', count);
    return users;
  }

  static async updateRoles(request: FastifyRequest<ToolsTypes.UpdateRoles>) {
    const { _id, roles } = request.body;
    if (_id === request.user._id) {
      throw ApiError.BadRequest(400, 'Wrong query');
    }
    const result = await ToolsService.updateRoles(_id, roles);
    return result;
  }

  static async setAvatar(this: FastifyInstance, request: FastifyRequest) {
    const file = await request.file({ limits: { fileSize: 2048e3, fieldSize: 2048e3 } });
    if (!file) {
      throw ApiError.BadRequest(400, 'File required');
    }
    const result = await ToolsService.setAvatar(request.user._id, file);
    return result;
  }
}
