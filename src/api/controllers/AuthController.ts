import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthTypes } from '@/types/index.js';
import { AuthService } from '@/api/services/index.js';

export default class AuthController {
  static async registration(request: FastifyRequest<AuthTypes.Registration>, reply: FastifyReply) {
    const userData = await AuthService.registration(request.body);
    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });

    return userData;
  }

  static async login(request: FastifyRequest<AuthTypes.Login>, reply: FastifyReply) {
    const userData = await AuthService.login(request.body);
    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 2592e6, // 30*24*60*60*1000
      httpOnly: true,
      sameSite: 'lax',
    });

    return userData;
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    await AuthService.logout(request.cookies.refreshToken);
    reply.clearCookie('refreshToken');
    return null;
  }

  static async refresh(request: FastifyRequest, reply: FastifyReply) {
    const userData = await AuthService.refresh(request.cookies.refreshToken);
    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 2592e6, // 30*24*60*60*1000
      httpOnly: true,
      sameSite: 'lax',
    });
    return userData;
  }

  static async activate(request: FastifyRequest<AuthTypes.Activate>, reply: FastifyReply) {
    await AuthService.activate(request.params.link);
    return reply.redirect(process.env.CLIENT_DOMAIN.split(' ')[0]);
  }

  static async restorePassword(request: FastifyRequest<AuthTypes.RestorePassword>) {
    const message = await AuthService.restorePassword(request.body.email);
    return message;
  }

  static async setNewPassword(request: FastifyRequest<AuthTypes.SetNewPassword>) {
    const message = await AuthService.setNewPassword(request.body);
    return message;
  }
}
