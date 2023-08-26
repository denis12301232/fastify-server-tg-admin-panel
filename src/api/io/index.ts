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

  private async onConnection(socket: SocketTyped) {
    const STATUS = 'online';
    if (!socket.data.user) {
      return;
    }

    const users = await ChatService.updateUserStatus(socket.data.user._id, STATUS);
    socket.to(users).emit('chat:user-status', socket.data.user._id, STATUS);
    socket.on('disconnect', this.onDisconnect);

    this.setEvents(socket);
  }

  private async onDisconnect(this: SocketTyped) {
    const STATUS = 'offline';
    if (!this.data.user) {
      return;
    }

    const users = await ChatService.updateUserStatus(this.data.user._id, STATUS);
    this.to(users).emit('chat:user-status', this.data.user._id, STATUS);
  }
}
