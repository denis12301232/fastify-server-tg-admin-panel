import type { DisconnectReason } from 'socket.io'
import type { ServerTyped, SocketTyped } from '@/types'
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares'
import SocketSchemas from '@/api/schemas/SocketSchemas'
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
      'webrtc:remove-peer': onWebRtcRemovePeer,
      'meet:create': onMeetCreate,
      'meet:leave': onMeetLeave,
      'meet:join': onMeetJoin
   }

   function onDisconnect(this: SocketTyped, reason: DisconnectReason, description?: any) {
      MessangerService.updateUserStatus(this.data.user!._id, 'offline');
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
            io.to(id).emit('chat:call-cancel');
         }
      }
   }

   function onWebRtcAddPeer(this: SocketTyped, chatId: string) {
      const { error } = SocketSchemas.webRtcAddPeer.validate({ chatId });
      if (error) {
         return this.disconnect(true);
      }
      const clientsIds = io.sockets.adapter.rooms.get(chatId);
      for (const id of clientsIds || []) {
         const user = io.sockets.sockets.get(id)?.data.user;
         if (user?._id !== this.data.user?._id) {
            io.to(id).emit('webrtc:add-peer', this.data.user!._id, false, this.data.user);
            this.emit('webrtc:add-peer', user?._id!, true, user);
         }
      }
   }

   function onWebRtcRemovePeer(this: SocketTyped, chatId: string) {
      const { error } = SocketSchemas.webRtcRemovePeer.validate({ chatId });
      if (error) {
         return this.disconnect(true);
      }
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
      const { error } = SocketSchemas.webRtcSdp.validate({ peerId, sdp });
      if (error) {
         return this.disconnect(true);
      }
      this.to(peerId).emit('webrtc:sdp', this.data.user!._id, sdp);
   }

   function onWebRtcIce(this: SocketTyped, peerId: string, ice: RTCIceCandidate) {
      const { error } = SocketSchemas.webRtcIce.validate({ peerId });
      if (error) {
         return this.disconnect(true);
      }
      this.to(peerId).emit('webrtc:ice', this.data.user!._id, ice);
   }

   function onMeetCreate(this: SocketTyped, title: string) {
      const { error } = SocketSchemas.meetCreate.validate({ title });
      if (error) {
         return this.disconnect(true);
      }
      const meetId = v4();
      this.emit('meet:create', meetId);
   }

   function onMeetJoin(this: SocketTyped, meetId: string) {
      const { error } = SocketSchemas.meetJoin.validate({ meetId });
      if (error) {
         return this.disconnect(true);
      }
      this.join(meetId);
      const clientsIds = io.sockets.adapter.rooms.get(meetId);
      for (const id of clientsIds || []) {
         const user = io.sockets.sockets.get(id)?.data.user;
         if (user?._id !== this.data.user?._id) {
            io.to(id).emit('webrtc:add-peer', this.data.user!._id, false, this.data.user);
            this.emit('webrtc:add-peer', user?._id!, true, user);
         }
      }
   }

   function onMeetLeave(this: SocketTyped, meetId: string) {
      const { error } = SocketSchemas.meetLeave.validate({ meetId });
      if (error) {
         return this.disconnect(true);
      }
      this.broadcast.to(meetId).emit('webrtc:remove-peer', this.data.user!._id);
      this.leave(meetId);
   }

   return new Map<keyof typeof list, typeof list[keyof typeof list]>(Object.entries(list) as any);
}
