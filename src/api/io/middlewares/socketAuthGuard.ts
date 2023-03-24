import type { Socket } from 'socket.io'
import { TokenService } from '@/api/services'
import { UserDto } from '@/dto'
import { ApiError } from '@/exeptions'


export default function socketAuthGuard(socket: Socket, next: (e?: Error) => any) {
   const accessToken = socket.handshake.auth.token;
   const userData = TokenService.validateAccessToken<UserDto>(accessToken);

   if (!userData) {
      return next( ApiError.Unauthorized());
   }
   
   socket.data.user = userData;
   socket.join(userData._id);
   next();
}