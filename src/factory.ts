import type { FastifyInstance } from 'fastify'
import type { ObjectSchema } from 'joi'
import fastifyEnv from '@fastify/env'
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyAutoload from '@fastify/autoload'
import fastifyStatic from '@fastify/static'
import { ErrorHandler } from '@/exeptions/ErrorHandler'
import { join, resolve } from 'path'


export async function factory(fastify: FastifyInstance) {
   await fastify.register(fastifyEnv, {
      schema: { type: 'object' },
      dotenv: { path: `.env.${process.env.NODE_ENV || 'production'}`, debug: true }
   });
   fastify.register(fastifyAutoload, { dir: join(__dirname, 'plugins') });
   fastify.register(cors, {
      credentials: true,
      origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(' ') : `http://localhost:${process.env.PORT}`,
      exposedHeaders: ['X-Total-Count']
   });
   fastify.register(fastifyCookie, { hook: 'onRequest' });
   fastify.register(fastifyAutoload, { dir: join(__dirname, 'routes'), options: { prefix: '/api' } });
   fastify.register(fastifyStatic, { root: resolve(__dirname, '../public') });
   fastify.setValidatorCompiler(({ schema }: { schema: ObjectSchema }) => data => schema.validate(data));
   fastify.setNotFoundHandler((request, reply) => { reply.sendFile('index.html') });
   fastify.setErrorHandler(ErrorHandler(fastify));
   await fastify.ready();
}