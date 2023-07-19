import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthTypes } from '@/types/index.js';
import { AuthService } from '@/api/services/index.js';

export default class AuthController {
  static async registration(request: FastifyRequest<AuthTypes.UserRegistration>, reply: FastifyReply) {
    const user = request.body;
    const userData = await AuthService.registration(user);

    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });

    return userData;
  }

  static async login(request: FastifyRequest<AuthTypes.UserLogin>, reply: FastifyReply) {
    const user = request.body;
    const userData = await AuthService.login(user);

    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });

    return userData;
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.cookies;
    await AuthService.logout(refreshToken);
    reply.clearCookie('refreshToken');
    return null;
  }

  static async refresh(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.cookies;
    const userData = await AuthService.refresh(refreshToken);
    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });
    return userData;
  }

  static async activate(request: FastifyRequest<AuthTypes.UserActivate>, reply: FastifyReply) {
    const { link } = request.params;
    await AuthService.activate(link);
    return reply.redirect(process.env.CLIENT_DOMAIN.split(' ')[0]);
  }

  static async restorePassword(request: FastifyRequest<AuthTypes.UserPasswordRestore>) {
    const { email } = request.body;
    const message = await AuthService.restorePassword(email);
    return message;
  }

  static async setNewRestoredPassword(request: FastifyRequest<AuthTypes.UserNewRestoredPassword>) {
    const { password, link } = request.body;
    const message = await AuthService.setNewRestoredPassword(password, link);
    return message;
  }
}
