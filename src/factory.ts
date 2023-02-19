import type { FastifyInstance } from 'fastify'
import type { ObjectSchema } from 'joi'
import fastifyAutoload from '@fastify/autoload'
import fastifyStatic from '@fastify/static'
import fastifyWebsocket from '@fastify/websocket'
import { join, resolve } from 'path'
import { ErrorHandler } from '@/exeptions/ErrorHandler'


export async function factory(fastify: FastifyInstance) {
   await fastify.register(import('@fastify/env'), {
      schema: { type: 'object' },
      dotenv: { path: `.env.${process.env.NODE_ENV || 'production'}`, debug: true }
   });
   fastify.register(fastifyAutoload, { dir: join(__dirname, 'plugins') });
   fastify.register(import('@fastify/cors'), {
      credentials: true,
      origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(' ') : `http://localhost:${process.env.PORT}`,
      exposedHeaders: ['X-Total-Count'],
      hook: 'preValidation',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
   });
   fastify.register(import('@fastify/cookie'), { hook: 'onRequest' });
   fastify.register(fastifyWebsocket, {
      errorHandler: function (e, connection, request, reply) {
         connection.destroy(e);
         request.log.error(e);
      }
   });
   fastify.register(import('@fastify/multipart'));
   fastify.register(fastifyAutoload, {
      dir: join(__dirname, 'routes'),
      options: { prefix: '/api' },
   });
   fastify.register(fastifyStatic, {
      root: resolve(__dirname, '../public')
   });
   fastify.register(fastifyStatic, {
      root: resolve(__dirname, '../static/images/avatars'),
      prefix: '/avatars',
      decorateReply: false
   });
   fastify.register(fastifyStatic, {
      root: resolve(__dirname, '../static/audio'),
      prefix: '/audio',
      decorateReply: false,
   });
   fastify.register(fastifyStatic, {
      root: resolve(__dirname, '../static/media'),
      prefix: '/media',
      decorateReply: false,
   });
   fastify.setValidatorCompiler(({ schema }: { schema: ObjectSchema }) => data => schema.validate(data));
   fastify.setNotFoundHandler((request, reply) => { reply.sendFile('index.html') });
   fastify.setErrorHandler(ErrorHandler(fastify));

   await fastify.ready();
}