import type { Server } from 'socket.io'
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares'
import { ACTIONS } from '@/util'


export function setupSocketListeners(io: Server) {
   io.use(socketAuthGuard);
   io.use(joinUserChats);
   io.on('connection', async (socket) => {
      socket.to(Array.from(socket.rooms)).emit(ACTIONS.UPDATE_STATUS, socket.data.user._id, 'online');
      socket.on(ACTIONS.TYPING, (chat_id: string, user_name: string, user_id: string) => {
         console.log(chat_id, user_name, user_id);
         socket.to(chat_id).emit('typing', chat_id, user_name, user_id);
      });

      socket.on('disconnect', () => {
         socket.to(Array.from(socket.rooms)).emit(ACTIONS.UPDATE_STATUS, socket.data.user._id, 'offline');
      })
   });
}