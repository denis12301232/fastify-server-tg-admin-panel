import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { MeetTypes } from '@/types/index.js';
import ApiError from '@/exceptions/ApiError.js';

export default class MeetController {
  static async getMeetInfo(this: FastifyInstance, request: FastifyRequest<{ Querystring: MeetTypes.GetInfoQuery }>) {
    const { redis } = this;
    const info = await redis.hGet('meets', request.query.meetId);

    if (!info) {
      throw ApiError.BadRequest(404, 'Meet not found');
    }

    return JSON.parse(info);
  }
}
