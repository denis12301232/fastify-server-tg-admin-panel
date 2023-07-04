import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { TokenService } from '@/api/services/index.js';
import { UserDto } from '@/dto/index.js';
import ApiError from '@/exceptions/ApiError.js';

interface RequestGeneric {
  Querystring: any;
  Body: any;
  Params: any;
  Headers: {
    authorization: string;
  };
  Reply: any;
}

export function useAuthGuard(
  request: FastifyRequest<RequestGeneric>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
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
