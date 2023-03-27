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
      socket.on('disconnect', onDisconnect);
      socket.on(ACTIONS.TYPING, onTyping);
      socket.on(ACTIONS.PEER_JOIN, onPeerJoin);
   }

   setListeners() {
      this.io.on('connection', this.onConnection);
   }
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

function onPeerJoin(this: Socket, roomId: string) {
   this.broadcast.to(roomId).emit(ACTIONS.PEER_ADD);
}