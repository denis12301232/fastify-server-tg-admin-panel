import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { AuthTypes, IGoogleUser, IFacebookUser } from '@/types/index.js';
import { AuthService, MailService } from '@/api/services/index.js';
import { got } from 'got';

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

  static async googleOAuth2(this: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
    const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const user = await got.get(url, { headers: { Authorization: 'Bearer ' + token.access_token } }).json<IGoogleUser>();
    const userData = await AuthService.oAuth2(user);

    reply
      .setCookie('refreshToken', userData.refreshToken, {
        maxAge: 2592e6, // 30 * 24 * 60 * 60 * 1000
        httpOnly: true,
        sameSite: 'lax',
        path: '/api/v1/auth',
        domain: process.env.DOMAIN_NAME,
      })
      .redirect(302, `${process.env.CLIENT_DOMAIN}/oauth2?accessToken=${userData.accessToken}`);

    return null;
  }

  static async facebookOAuth2(this: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
    const { token } = await this.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    const url = 'https://graph.facebook.com/me';
    const user = await got
      .get(url, { searchParams: { access_token: token.access_token, fields: 'email,name' } })
      .json<IFacebookUser>();
    const userData = await AuthService.oAuth2(user);

    reply
      .setCookie('refreshToken', userData.refreshToken, {
        maxAge: 2592e6, // 30 * 24 * 60 * 60 * 1000
        httpOnly: true,
        sameSite: 'lax',
        path: '/api/v1/auth',
        domain: process.env.DOMAIN_NAME,
      })
      .redirect(302, `${process.env.CLIENT_DOMAIN}/oauth2?accessToken=${userData.accessToken}`);

    return null;
  }
}
