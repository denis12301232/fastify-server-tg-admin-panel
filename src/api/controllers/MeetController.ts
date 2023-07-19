import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { MeetTypes } from '@/types/index.js';
import ApiError from '@/exceptions/ApiError.js';

export default class MeetController {
  static async getMeetInfo(this: FastifyInstance, request: FastifyRequest<MeetTypes.GetInfo>) {
    const { redis } = this;
    const info = await redis.json.get('meets', { path: [`.${request.query.meetId}`] });

    if (!info) {
      throw ApiError.BadRequest(404, 'Meet not found');
    }

    return info;
  }
}
