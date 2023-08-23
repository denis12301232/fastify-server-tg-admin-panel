import type { ServerTyped, SocketTyped, Entries } from '@/types/index.js';
import { useChatEvents, useMeetEvents, useWebRtcEvents } from '@/api/io/events/index.js';
import { socketAuthGuard, joinUserChats } from '@/api/io/middlewares/index.js';
import { ChatService } from '@/api/services/index.js';

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
    new Map<keyof typeof events, (typeof events)[keyof typeof events]>(
      Object.entries(events) as Entries<typeof events>
    ).forEach((func, event) => socket.on(event, func));
  }

  private onConnection(socket: SocketTyped) {
    if (!socket.data.user) {
      return;
    }

    ChatService.updateUserStatus(socket, socket.data.user._id, 'online');
    socket.on('disconnect', this.onDisconnect);
    this.setEvents(socket);
  }

  private onDisconnect(this: SocketTyped) {
    if (!this.data.user) {
      return;
    }

    ChatService.updateUserStatus(this, this.data.user._id, 'offline');
  }
}
