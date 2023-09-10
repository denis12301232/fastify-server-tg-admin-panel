import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { MeetTypes } from '@/types/index.js';
import ApiError from '@/exceptions/ApiError.js';

export default class MeetController {
  static async show(this: FastifyInstance, request: FastifyRequest<MeetTypes.Show>){
    const info = await this.redis.json.get('meets', { path: [`.${request.params.id}`] }).catch(() => {
      throw ApiError.BadRequest(404, 'Meet not found');
    });

    return info;
  }
}
