import type { SocketTyped, ServerTyped } from '@/types'
import SocketSchemas from '@/api/schemas/SocketSchemas'


export default function useWebRtcEvents(io: ServerTyped) {
   const events = {
      'webrtc:add-peer': onWebRtcAddPeer,
      'webrtc:sdp': onWebRtcSdp,
      'webrtc:ice': onWebRtcIce,
      'webrtc:remove-peer': onWebRtcRemovePeer,
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
            this.to(id).emit('webrtc:add-peer', this.data.user!._id, false, this.data.user);
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

   return events;
}