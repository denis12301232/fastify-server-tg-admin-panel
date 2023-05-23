import type { Socket } from 'socket.io';
import { ChatService } from '@/api/services/index.js';

export default async function joinUserChats(socket: Socket, next: (e?: Error) => void) {
  const user_id = socket.data.user._id;
  const ids = await ChatService.getUserChatsId(user_id);
  ids.forEach((id) => socket.join(id));
  next();
}
