import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { TokenService } from '@/api/services'
import { UserDto } from '@/dto'
import { ApiError } from '@/exeptions'


export function useSocketGuard(request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply, done: HookHandlerDoneFunction) {
   const authHeader = request.query.token;

   if (!authHeader || !authHeader.split(' ')[1]) {
      throw ApiError.Unauthorized();
   }

   const accessToken = authHeader.split(' ')[1];
   const userData = TokenService.validateAccessToken<UserDto>(accessToken);

   if (!userData) {
      throw ApiError.Unauthorized();
   }

   request.user = userData;
   return done();
}