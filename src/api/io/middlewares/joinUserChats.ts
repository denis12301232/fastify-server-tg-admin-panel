import type { Socket } from 'socket.io'
import { MessangerService } from '@/api/services';


export default async function joinUserChats(socket: Socket, next: (e?: Error) => any) {
   const user_id = socket.data.user._id;
   const ids = await MessangerService.getUserChatsId(user_id);
   ids.forEach((id) => socket.join(id));
   next();
}