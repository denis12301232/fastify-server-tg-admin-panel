import type { FastifyInstance } from 'fastify';
import type { ObjectSchema } from 'joi';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyAutoload from '@fastify/autoload';
import { join } from 'path';
import { fileURLToPath } from 'url';
import apiErrorHandler from '@/exceptions/apiErrorHandler.js';
import Plugins from '@/plugins/Plugins.js';

export default async function factory(app: FastifyInstance) {
  const dirname = fileURLToPath(new URL('.', import.meta.url));

  app.register(fastifyCors, {
    origin: process.env.CLIENT_DOMAIN.split(' '),
    credentials: true,
    exposedHeaders: ['X-Total-Count'],
  });
  app.register(fastifyCookie, { hook: 'onRequest' });
  app.register(fastifyMultipart, { limits: { fileSize: 1e9, files: 10 } });
  app.register(fastifyAutoload, {
    dir: join(dirname, 'routes'),
    options: { prefix: '/api' },
    forceESM: true,
  });
  app.register(Plugins.i18n, { fallbackLocale: 'ru' });
  app.register(Plugins.io, {
    cors: {
      origin: process.env.CLIENT_DOMAIN.split(' '),
      credentials: true,
      exposedHeaders: ['X-Total-Count'],
    },
    path: '/socket',
  });
  app.register(Plugins.mongo, { url: process.env.MONGO_URL, opts: { dbName: process.env.MONGO_NAME } });
  app.register(Plugins.redis, { url: process.env.REDIS_URL });
  app.setValidatorCompiler<ObjectSchema>(
    ({ schema }) =>
      (data) =>
        schema.validate(data)
  );
  app.setNotFoundHandler(async () => ({ code: 404, message: 'Not Found' }));
  app.setErrorHandler(apiErrorHandler);
  await app.ready();
}
