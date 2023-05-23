import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import Joi from 'joi';
import ApiError from './ApiError.js';

export default function apiErrorHandler(this: FastifyInstance, e: Error, request: FastifyRequest, reply: FastifyReply) {
  this.log.error({ name: e.name, msg: e.message });
  if (e instanceof ApiError) {
    return reply.status(e.status).send({ message: e.message, errors: e.errors });
  } else if (e instanceof Joi.ValidationError) {
    return reply.status(403).send({ message: e.message, errors: e.details });
  } else {
    return reply.status(500).send(e.message);
  }
}
