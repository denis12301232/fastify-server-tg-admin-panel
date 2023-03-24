import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { TokenService } from '@/api/services'
import { UserDto } from '@/dto'
import ApiError from '@/exeptions/ApiError'


interface RequestGeneric {
   Querystring: any;
   Body: any;
   Params: any;
   Headers: {
      authorization: string;
   };
   Reply: any;
}

export function useAuthGuard(request: FastifyRequest<RequestGeneric>, reply: FastifyReply, done: HookHandlerDoneFunction) {
   const authHeader = request.headers.authorization;
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