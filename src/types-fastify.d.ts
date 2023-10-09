import type { ServerTyped } from '@/types/io.js';
import type { UserDto } from '@/dto/index.js';
import type { RedisClientType } from 'redis';
import type Polyglot from 'node-polyglot';
import { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
  export interface FastifyRequest {
    user: UserDto;
  }

  export interface FastifyInstance {
    io: ServerTyped;
    redis: RedisClientType;
    i18n: Polyglot;
    googleOAuth2: OAuth2Namespace;
    facebookOAuth2: OAuth2Namespace;
  }
}
