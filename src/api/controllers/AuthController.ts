import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthTypes } from '@/types/index.js';
import { AuthService } from '@/api/services/index.js';

export default class AuthController {
  static async registration(request: FastifyRequest<{ Body: AuthTypes.UserRegistrationBody }>, reply: FastifyReply) {
    const user = request.body;
    const userData = await AuthService.registration(user);

    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });

    return userData;
  }

  static async login(request: FastifyRequest<{ Body: AuthTypes.UserLoginBody }>, reply: FastifyReply) {
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

  static async activate(request: FastifyRequest<{ Params: AuthTypes.UserActivateParams }>, reply: FastifyReply) {
    const { link } = request.params;
    await AuthService.activate(link);
    return reply.redirect(process.env.CLIENT_DOMAIN.split(' ')[0]);
  }

  static async restorePassword(request: FastifyRequest<{ Body: AuthTypes.UserPasswordRestoreBody }>) {
    const { email } = request.body;
    const message = await AuthService.restorePassword(email);
    return message;
  }

  static async setNewRestoredPassword(request: FastifyRequest<{ Body: AuthTypes.UserNewRestoredPasswordBody }>) {
    const { password, link } = request.body;
    const message = await AuthService.setNewRestoredPassword(password, link);
    return message;
  }
}
