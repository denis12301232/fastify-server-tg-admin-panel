import type { Server, Socket } from 'socket.io'
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares'
import { ACTIONS } from '@/util'


export default class IO {
   private readonly io: Server;

   constructor(io: Server) {
      this.io = io;
      this.io.use(socketAuthGuard);
      this.io.use(joinUserChats);
   }

   private onConnection(socket: Socket) {
      socket.to(Array.from(socket.rooms)).emit(ACTIONS.UPDATE_STATUS, socket.data.user._id, 'online');
      socket.on(ACTIONS.TYPING, (chat_id: string, user_name: string, user_id: string) => {
         socket.to(chat_id).emit('typing', chat_id, user_name, user_id);
      });
      socket.on('disconnect', () => {
         socket.to(Array.from(socket.rooms)).emit(ACTIONS.UPDATE_STATUS, socket.data.user._id, 'offline');
      });
   }

   setListeners() {
      this.io.on('connection', this.onConnection);
   }
}