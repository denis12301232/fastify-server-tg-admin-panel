import { ServerTyped } from '@/types';
import type { UserDto } from '@/dto'


declare module 'fastify' {
   export interface FastifyRequest {
      user: UserDto;
   }
   export interface FastifyReply {
      temp: {
         subtasksCsv: string;
      }
   }
   export interface FastifyInstance {
      io: ServerTyped;
   }
}