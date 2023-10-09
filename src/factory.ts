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
import { fastifyOauth2 } from '@fastify/oauth2';

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
  app.register(fastifyOauth2, {
    name: 'googleOAuth2',
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/api/v1/auth/oauth2/google',
    callbackUri: 'http://localhost:5000/api/v1/auth/oauth2/google/callback',
    callbackUriParams: {
      access_type: 'offline',
    },
    scope: ['profile', 'email'],
  });
  app.register(fastifyOauth2, {
    name: 'facebookOAuth2',
    credentials: {
      client: {
        id: process.env.FACEBOOK_CLIENT_ID,
        secret: process.env.FACEBOOK_CLIENT_SECRET,
      },
      auth: fastifyOauth2.FACEBOOK_CONFIGURATION,
    },
    startRedirectPath: '/api/v1/auth/oauth2/facebook',
    callbackUri: 'http://localhost:5000/api/v1/auth/oauth2/facebook/callback',
    scope: ['public_profile', 'email'],
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
