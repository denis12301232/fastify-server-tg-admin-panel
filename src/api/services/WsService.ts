import type { WsMessage } from '@/types/interfaces'
import { fastify } from '@/main'


export class WsService {
   static broadcastMessage(message: WsMessage, users: string[]) {
      fastify.websocketServer.clients.forEach(client => {
         if (!users.includes(client.id)) {
            return;
         }
         client.send(JSON.stringify(message));
      });
   }

   static sendMessage(message: WsMessage, user_id: string) {
      const socket = Array.from(fastify.websocketServer.clients)
         .find((client => client.id === user_id));

      if (socket) {
         socket?.send(JSON.stringify(message));
      }
   }
}