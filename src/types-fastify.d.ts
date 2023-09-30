import type { ServerTyped } from '@/types/io.js';
import type { UserDto } from '@/dto/index.js';
import type { RedisClientType } from 'redis';
import type Polyglot from 'node-polyglot';

declare module 'fastify' {
  export interface FastifyRequest {
    user: UserDto;
  }

  export interface FastifyInstance {
    io: ServerTyped;
    redis: RedisClientType;
    i18n: Polyglot;
  }
}
