import type { Server, Socket, DisconnectReason } from 'socket.io'
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares'
import { ACTIONS } from '@/util'
import { MessangerSchemas } from '@/api/schemas/MessangerSchemas'


export default function setSocketListeners(io: Server) {
   io.use(socketAuthGuard);
   io.use(joinUserChats);
   const events = useSocketEvents(io);
   io.on('connection', onConnection);

   function onConnection(socket: Socket) {
      socket.to(Array.from(socket.rooms)).emit(ACTIONS.UPDATE_STATUS, socket.data.user._id, 'online'); 
      events.forEach((func, event) => socket.on(event, func));
   }
}

function useSocketEvents(io: Server) {
   const list = {
      'disconnect': onDisconnect,
      [ACTIONS.TYPING]: onTyping,
   }

   function onTyping(this: Socket, chat_id: string, user_name: string, user_id: string) {
      const { error } = MessangerSchemas.typingSchema.validate({ chat_id, user_name, user_id });
      if (error) {
         return this.disconnect(true);
      }
      this.broadcast.to(chat_id).emit(ACTIONS.TYPING, chat_id, user_name, user_id);
   }

   function onDisconnect(this: Socket, reason: DisconnectReason, description?: any) {
      this.to(Array.from(this.rooms)).emit(ACTIONS.UPDATE_STATUS, this.data.user._id, 'offline');
   }

   return new Map(Object.entries(list));
}

