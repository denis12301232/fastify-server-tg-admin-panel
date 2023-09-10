import type { FastifyRequest, FastifyReply } from 'fastify';
import type { UserTypes } from '@/types/index.js';
import { UserService } from '@/api/services/index.js';

export default class UserController {
  static async index(request: FastifyRequest<UserTypes.GetUsers>, reply: FastifyReply) {
    const { users, count } = await UserService.index(request.user._id, request.query);
    reply.header('X-Total-Count', count);
    return users;
  }

  static async show(request: FastifyRequest<UserTypes.GetUser>) {
    const user = await UserService.show(request.params.id);
    return user;
  }

  static async updateEmail(request: FastifyRequest<UserTypes.UpdateEmail>) {
    const result = await UserService.updateEmail(request.user._id, request.body.email);
    return result;
  }

  static async updateName(request: FastifyRequest<UserTypes.UpdateName>) {
    const result = await UserService.updateName(request.user._id, request.body.name);
    return result;
  }

  static async updateAvatar(request: FastifyRequest) {
    const data = await request.file();
    const result = await UserService.updateAvatar(request.user._id, data);
    return result;
  }

  static async updatePassword(request: FastifyRequest<UserTypes.UpdatePassword>) {
    const result = await UserService.updatePassword(request.user._id, request.body);
    return result;
  }

  static async updateRoles(request: FastifyRequest<UserTypes.UpdateRoles>) {
    const result = await UserService.updateRoles(request.user._id, request.body);
    return result;
  }
}
