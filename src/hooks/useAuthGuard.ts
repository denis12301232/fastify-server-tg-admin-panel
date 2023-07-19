import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction, RouteGenericInterface } from 'fastify';
import type { UserDto } from '@/dto/index.js';
import { TokenService } from '@/api/services/index.js';
import ApiError from '@/exceptions/ApiError.js';

export function useAuthGuard<T extends RouteGenericInterface>(
  request: FastifyRequest<T>,
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
