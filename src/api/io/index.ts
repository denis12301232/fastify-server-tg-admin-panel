import type { Server, Socket, DisconnectReason } from 'socket.io'
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares'
import { ACTIONS } from '@/util'
import { MessangerSchemas } from '@/api/schemas/MessangerSchemas'


export default class IO {
   private readonly io: Server;

   constructor(io: Server) {
      this.io = io;
      this.io.use(socketAuthGuard);
      this.io.use(joinUserChats);
   }

   private onConnection(socket: Socket) {
      socket.to(Array.from(socket.rooms)).emit(ACTIONS.UPDATE_STATUS, socket.data.user._id, 'online');
      socket.on(ACTIONS.TYPING, this.onTyping(socket));
      socket.on('disconnect', this.onDisconnect(socket));
   }

   private onTyping(socket: Socket) {
      return function (chat_id: string, user_name: string, user_id: string) {
         const { error } = MessangerSchemas.typingSchema.validate({ chat_id, user_name, user_id });
         if (error) {
            return socket.disconnect(true);
         }
         socket.to(chat_id).emit(ACTIONS.TYPING, chat_id, user_name, user_id);
      }
   }

   private onDisconnect(socket: Socket) {
      return function (reason: DisconnectReason, description?: any) {
         socket.to(Array.from(socket.rooms)).emit(ACTIONS.UPDATE_STATUS, socket.data.user._id, 'offline');
      }
   }

   setListeners() {
      this.io.on('connection', this.onConnection);
   }
}