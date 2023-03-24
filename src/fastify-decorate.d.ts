import type { Server } from 'socket.io'
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
      io: Server;
   }
}