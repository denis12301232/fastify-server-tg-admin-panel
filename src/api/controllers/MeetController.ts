import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { MeetTypes } from '@/types';
import { ApiError } from '@/exeptions';


export default class MeetController {
   static async getMeetInfo(this: FastifyInstance, request: FastifyRequest<{ Querystring: MeetTypes.GetInfoQuery }>, reply: FastifyReply) {
      const { redis } = this;
      const info = await redis.hGet('meets', request.query.meetId);

      if (!info) {
         throw ApiError.BadRequest(404, 'Meet not found');
      }

      return JSON.parse(info);
   }
}