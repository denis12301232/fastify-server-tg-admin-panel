import type { SocketTyped, ServerTyped } from '@/types'
import SocketSchemas from '@/api/schemas/SocketSchemas'


export default function useChatEvents(io: ServerTyped) {
   const events = {
      'chat:typing': onChatTyping,
      'chat:call': onChatCall,
      'chat:call-answer': onChatCallAnswer,
      'chat:call-cancel': onChatCallCancel,
   }

   function onChatTyping(this: SocketTyped, chatId: string, userName: string, userId: string) {
      const { error } = SocketSchemas.chatTyping.validate({ chatId, userName, userId });
      if (error) {
         return this.disconnect(true);
      }
      this.broadcast.to(chatId).emit('chat:typing', chatId, userName, userId);
   }

   function onChatCall(this: SocketTyped, chatId: string) {
      const { error } = SocketSchemas.chatCall.validate({ chatId });
      if (error) {
         return this.disconnect(true);
      }
      this.broadcast.to(chatId).emit('chat:call', chatId);
   }

   function onChatCallAnswer(this: SocketTyped, chatId: string, answer: boolean) {
      const { error } = SocketSchemas.chatCallAnswer.validate({ chatId, answer });
      if (error) {
         return this.disconnect(true);
      }
      answer
         ? this.broadcast.to(chatId).emit('chat:call-answer', chatId, true)
         : this.broadcast.to(chatId).emit('chat:call-answer', chatId, false);
   }

   function onChatCallCancel(this: SocketTyped, chatId: string) {
      const { error } = SocketSchemas.chatCallCancel.validate({ chatId });
      if (error) {
         return this.disconnect(true);
      }

      const clientsIds = io.sockets.adapter.rooms.get(chatId);
      for (const id of clientsIds || []) {
         const userId = io.sockets.sockets.get(id)?.data.user?._id;
         if (userId !== this.data.user?._id) {
            this.to(id).emit('chat:call-cancel');
         }
      }
   }

   return events;
}