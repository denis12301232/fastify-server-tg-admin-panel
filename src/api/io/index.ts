import type { DisconnectReason } from 'socket.io'
import type { ServerTyped, SocketTyped } from '@/types'
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares'
import { MessangerSchemas } from '@/api/schemas/MessangerSchemas'
import MessangerService from '@/api/services/MessangerService'
import { v4 } from 'uuid'



export default function setSocketListeners(io: ServerTyped) {
   io.use(socketAuthGuard);
   io.use(joinUserChats);
   const events = useSocketEvents(io);
   io.on('connection', onConnection);

   function onConnection(socket: SocketTyped) {
      MessangerService.updateUserStatus(socket.data.user!._id, 'online');
      events.forEach((func, event) => socket.on(event, func));
   }
}

function useSocketEvents(io: ServerTyped) {
   const list = {
      'disconnect': onDisconnect,
      'chat:typing': onChatTyping,
      'chat:call': onChatCall,
      'chat:call-answer': onChatCallAnswer,
      'chat:call-cancel': onChatCallCancel,
      'webrtc:add-peer': onWebRtcAddPeer,
      'webrtc:sdp': onWebRtcSdp,
      'webrtc:ice': onWebRtcIce,
      'webrtc:identify-stream': onWebRtcIdentifyStream,
      'webrtc:negotiate': onWebRtcNegitiate,
      'webrtc:remove-peer': onWebRtcRemovePeer,
      'meet:create': onMeetCreate,
      'meet:leave': onMeetLeave,
      'meet:join': onMeetJoin
   }

   function onDisconnect(this: SocketTyped, reason: DisconnectReason, description?: any) {
      MessangerService.updateUserStatus(this.data.user!._id, 'offline');
   }

   function onChatTyping(this: SocketTyped, chat_id: string, user_name: string, user_id: string) {
      const { error } = MessangerSchemas.typingSchema.validate({ chat_id, user_name, user_id });
      if (error) {
         return this.disconnect(true);
      }
      this.broadcast.to(chat_id).emit('chat:typing', chat_id, user_name, user_id);
   }

   function onChatCall(this: SocketTyped, chatId: string) {
      this.broadcast.to(chatId).emit('chat:call', chatId);
   }

   function onChatCallAnswer(this: SocketTyped, chatId: string, answer: boolean) {
      answer
         ? this.broadcast.to(chatId).emit('chat:call-answer', chatId, true)
         : this.broadcast.to(chatId).emit('chat:call-answer', chatId, false);
   }

   function onChatCallCancel(this: SocketTyped, chatId: string) {
      const clientsIds = io.sockets.adapter.rooms.get(chatId);
      for (const id of clientsIds || []) {
         const userId = io.sockets.sockets.get(id)?.data.user?._id;
         if (userId !== this.data.user?._id) {
            io.to(id).emit('chat:call-cancel');
         }
      }
   }

   function onWebRtcAddPeer(this: SocketTyped, chatId: string) {
      const clientsIds = io.sockets.adapter.rooms.get(chatId);
      for (const id of clientsIds || []) {
         const userId = io.sockets.sockets.get(id)?.data.user?._id;
         if (userId !== this.data.user?._id) {
            io.to(id).emit('webrtc:add-peer', this.data.user!._id, false);
            this.emit('webrtc:add-peer', userId!, true);
         }
      }
   }

   function onWebRtcRemovePeer(this: SocketTyped, chatId: string) {
      const clientsIds = io.sockets.adapter.rooms.get(chatId);
      for (const id of clientsIds || []) {
         const userId = io.sockets.sockets.get(id)?.data.user?._id;
         if (userId !== this.data.user?._id) {
            io.to(id).emit('webrtc:remove-peer', this.data.user!._id);
            this.emit('webrtc:remove-peer', userId!);
         }
      }
   }

   function onWebRtcSdp(this: SocketTyped, peerId: string, sdp: RTCSessionDescriptionInit) {
      this.to(peerId).emit('webrtc:sdp', this.data.user!._id, sdp);
   }

   function onWebRtcIce(this: SocketTyped, peerId: string, ice: RTCIceCandidate) {
      this.to(peerId).emit('webrtc:ice', this.data.user!._id, ice);
   }

   function onWebRtcIdentifyStream(this: SocketTyped, chatId: string, type: 'screen' | 'camera', id: string) {
      this.broadcast.to(chatId).emit('webrtc:identify-stream', type, id);
   }

   function onWebRtcNegitiate(this: SocketTyped, peerId: string) {
      this.to(peerId).emit('webrtc:negotiate', peerId);
   }

   function onMeetCreate(this: SocketTyped, title: string) {
      const meetId = v4();
      this.emit('meet:create', meetId);
   }

   function onMeetJoin(this: SocketTyped, meetId: string) {
      this.join(meetId);
      const clientsIds = io.sockets.adapter.rooms.get(meetId);
      for (const id of clientsIds || []) {
         const userId = io.sockets.sockets.get(id)?.data.user?._id;
         if (userId !== this.data.user?._id) {
            io.to(id).emit('webrtc:add-peer', this.data.user!._id, false);
            this.emit('webrtc:add-peer', userId!, true);
         }
      }
   }

   function onMeetLeave(this: SocketTyped, meetId: string) {
      this.broadcast.to(meetId).emit('webrtc:remove-peer', this.data.user!._id);
      this.leave(meetId);
   }

   return new Map<keyof typeof list, typeof list[keyof typeof list]>(Object.entries(list) as any);
}
