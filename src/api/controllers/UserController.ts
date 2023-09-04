import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { UserTypes } from '@/types/index.js';
import { UserService } from '@/api/services/index.js';

export default class UserController {
  static async index(request: FastifyRequest<UserTypes.GetUsers>, reply: FastifyReply) {
    const { users, count } = await UserService.getUsers(request.user._id, request.query);
    reply.header('X-Total-Count', count);
    return users;
  }

  static async show(request: FastifyRequest<UserTypes.GetUser>) {
    const user = await UserService.getUser(request.params.id);
    return user;
  }
}
