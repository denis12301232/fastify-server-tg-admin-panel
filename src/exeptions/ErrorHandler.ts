import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import ApiError from '@/exeptions/ApiError'

export function ErrorHandler(fastify: FastifyInstance) {
   return function (e: Error, request: FastifyRequest, reply: FastifyReply) {
      fastify.log.error(e);
      if (e instanceof ApiError) {
         return reply.status(e.status).send({ message: e.message, errors: e.errors });
      } else {
         return reply.status(500).send(e.message);
      }
   }
}