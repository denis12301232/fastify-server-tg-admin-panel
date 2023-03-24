import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { ValidationError } from 'joi'
import { ApiError } from '@/exeptions'


export function apiErrorHandler(this: FastifyInstance, e: Error, request: FastifyRequest, reply: FastifyReply) {
   this.log.error(e);
   if (e instanceof ApiError) {
      return reply.status(e.status).send({ message: e.message, errors: e.errors });
   } else if (e instanceof ValidationError) {
      return reply.status(403).send({ message: e.message, errors: e.details })
   } else {
      return reply.status(500).send(e.message);
   }
}