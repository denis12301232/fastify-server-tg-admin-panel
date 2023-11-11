import type { FastifyRequest, FastifyInstance } from 'fastify';
import type { CommentTypes } from '@/types/index.js';
import { CommentService } from '@/api/services/index.js';

export default class CommentsController {
  static async store(this: FastifyInstance, request: FastifyRequest<CommentTypes.Store>) {
    const result = await CommentService.store(request.user._id, request.body);
    return result;
  }

  static async index(request: FastifyRequest<CommentTypes.Index>) {
    const { comments, count } = await CommentService.index(request.query);
    return { comments, count };
  }

  static async update(request: FastifyRequest<CommentTypes.Update>) {
    const result = await CommentService.update(request.params.id, request.body);
    return result;
  }
}
