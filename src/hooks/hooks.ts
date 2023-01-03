import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { TokenService } from '@/api/services/TokenService'
import { UserDto } from '@/dto/UserDto'
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

export function useAuth(request: FastifyRequest<RequestGeneric>, reply: FastifyReply, done: HookHandlerDoneFunction) {
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

export function useRoleGuard(roles: string[]) {
   return function (request: FastifyRequest<RequestGeneric>, reply: FastifyReply, done: HookHandlerDoneFunction) {
      for (const role of roles) {
         if (request.user?.roles.includes(role)) return done();
      }
      throw ApiError.Forbidden();
   }
}