import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import ApiError from '@/exceptions/ApiError.js';

export function useRoleGuard(roles: string[]) {
  return function (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    for (const role of roles) {
      if (request.user?.roles.includes(role)) return done();
    }
    throw ApiError.Forbidden();
  };
}
