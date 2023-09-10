import type { Socket } from 'socket.io';
import { ChatService } from '@/api/services/index.js';

export default async function joinUserChats(socket: Socket, next: (e?: Error) => void) {
  const userId = socket.data.user._id;
  const ids = await ChatService.getUserChatsId(userId);
  ids.forEach((id) => socket.join(id));
  next();
}
