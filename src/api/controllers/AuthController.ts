import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { AuthTypes } from '@/types/index.js';
import { AuthService, MailService } from '@/api/services/index.js';

export default class AuthController {
  static async registration(
    this: FastifyInstance,
    request: FastifyRequest<AuthTypes.Registration>,
    reply: FastifyReply
  ) {
    const { activationLink, ...result } = await AuthService.registration(request.body);
    const link = `${process.env.CLIENT_DOMAIN}/api/auth/activate/${activationLink}`;

    MailService.send(
      result.user.email,
      this.i18n.t('mail.activation.subject', { site: process.env.CLIENT_DOMAIN }),
      this.i18n.t('mail.activation.messages.activation', { link })
    );

    reply.setCookie('refreshToken', result.refreshToken, {
      maxAge: 2592e6, // 30 * 24 * 60 * 60 * 1000
      httpOnly: true,
      sameSite: 'lax',
    });

    return result;
  }

  static async login(request: FastifyRequest<AuthTypes.Login>, reply: FastifyReply) {
    const userData = await AuthService.login(request.body);
    reply.setCookie('refreshToken', userData.refreshToken, {
      maxAge: 2592e6, // 30 * 24 * 60 * 60 * 1000
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
      maxAge: 2592e6, // 30 * 24 * 60 * 60 * 1000
      httpOnly: true,
      sameSite: 'lax',
    });
    return userData;
  }

  static async activate(request: FastifyRequest<AuthTypes.Activate>, reply: FastifyReply) {
    await AuthService.activate(request.params.link);
    return reply.redirect(process.env.CLIENT_DOMAIN.split(' ')[0]);
  }

  static async restorePassword(this: FastifyInstance, request: FastifyRequest<AuthTypes.RestorePassword>) {
    const result = await AuthService.restorePassword(request.body.email);
    const link = `${process.env.CLIENT_DOMAIN}/restore?link=${result?.restoreLink}`;

    MailService.send(
      request.body.email,
      this.i18n.t('mail.restore.subject', { site: process.env.CLIENT_DOMAIN }),
      this.i18n.t('mail.restore.messages.restore', { link })
    );
    return result;
  }

  static async setNewPassword(request: FastifyRequest<AuthTypes.SetNewPassword>) {
    const message = await AuthService.setNewPassword(request.body);
    return message;
  }
}
