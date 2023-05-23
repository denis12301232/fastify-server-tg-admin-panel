import type { Socket } from 'socket.io';
import { TokenService } from '@/api/services/index.js';
import { UserDto } from '@/dto/index.js';
import ApiError from '@/exceptions/ApiError.js';

export default function socketAuthGuard(socket: Socket, next: (e?: Error) => void) {
  const accessToken = socket.handshake.auth.token;

  if (!accessToken) {
    return next(ApiError.Unauthorized());
  }

  const userData = TokenService.validateAccessToken<UserDto>(accessToken);

  if (!userData) {
    return next(ApiError.Unauthorized());
  }

  socket.data.user = userData;
  socket.join(userData._id);
  next();
}
