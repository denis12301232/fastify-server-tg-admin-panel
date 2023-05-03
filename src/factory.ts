import type { FastifyInstance } from 'fastify'
import type { ObjectSchema } from 'joi'
import cors from '@fastify/cors'
import env from '@fastify/env'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import autoload from '@fastify/autoload'
import { socketIoPlugin, mongoDbPlugin, staticFoldersCreatePlugin } from '@/plugins'
import { join, resolve } from 'path'
import { apiErrorHandler } from '@/exeptions'


export default async function factory(app: FastifyInstance) {
   await app.register(env, {
      schema: { type: 'object' },
      dotenv: { path: `.env.${process.env.NODE_ENV || 'production'}`, debug: true }
   });

   await app.register(cors, {
      origin: process.env.CLIENT_DOMAIN.split(' '),
      credentials: true,
      exposedHeaders: ['X-Total-Count'],
   });

   app.register(cookie, { hook: 'onRequest' });
   app.register(socketIoPlugin, {
      cors: {
         origin: process.env.CLIENT_DOMAIN.split(' '),
         credentials: true,
         exposedHeaders: ['X-Total-Count'],
      },
      path: '/socket'
   });
   app.register(multipart, { limits: { fileSize: 100000000, files: 10 } });
   app.register(autoload, { dir: join(__dirname, 'routes'), options: { prefix: '/api' } });
   app.register(fastifyStatic, { root: resolve(__dirname, '../public') });
   app.register(fastifyStatic, {
      root: resolve(__dirname, '../static/images/avatars'),
      prefix: '/avatars',
      decorateReply: false
   });
   app.register(fastifyStatic, {
      root: resolve(__dirname, '../static/audio'),
      prefix: '/audio',
      decorateReply: false,
   });
   app.register(fastifyStatic, {
      root: resolve(__dirname, '../static/media'),
      prefix: '/media',
      decorateReply: false,
   });

   app.register(mongoDbPlugin, { url: process.env.MONGO_URL, opts: { dbName: process.env.MONGO_NAME } });
   app.register(staticFoldersCreatePlugin, ['../../static/audio', '../../static/images/avatars',
      '../../static/media', '../../public', '../../static/temp']);
   app.setValidatorCompiler(({ schema }: { schema: ObjectSchema }) => (data) => schema.validate(data));
   app.setNotFoundHandler((request, reply) => { reply.sendFile('index.html') });
   app.setErrorHandler(apiErrorHandler);
   await app.ready();
}