import type { UserDto } from '@/dto/UserDto'
import WebSocket from 'ws'


declare module 'fastify' {
   export interface FastifyRequest {
      user: UserDto;
   }

   export interface FastifyInstance {
      websocketServer: WebSocket.Server<WebSocket.WebSocket>;
   }
}