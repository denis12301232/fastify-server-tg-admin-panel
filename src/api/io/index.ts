import type { ServerTyped, SocketTyped } from '@/types'
import type { DisconnectReason } from 'socket.io'
import { useChatEvents, useMeetEvents, useWebRtcEvents } from '@/api/io/events'
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares'
import MessangerService from '@/api/services/MessangerService'


export default class SocketEvents {
   private readonly io: ServerTyped;

   constructor(io: ServerTyped) {
      this.io = io;
      this.io.use(socketAuthGuard);
      this.io.use(joinUserChats);
      this.onConnection = this.onConnection.bind(this);
      this.io.on('connection', this.onConnection);
   }

   private setEvents(socket: SocketTyped) {
      const events = Object.assign({}, useChatEvents(this.io), useMeetEvents(this.io), useWebRtcEvents(this.io));
      new Map<keyof typeof events, typeof events[keyof typeof events]>(Object.entries(events) as any)
         .forEach((func, event) => socket.on(event, func));
   }

   private onConnection(socket: SocketTyped) {
      MessangerService.updateUserStatus(socket.data.user!._id, 'online');
      socket.on('disconnect', this.onDisconnect);
      this.setEvents(socket);
   }

   private onDisconnect(this: SocketTyped, reason: DisconnectReason, description?: any) {
      MessangerService.updateUserStatus(this.data.user!._id, 'offline');
   }
}
