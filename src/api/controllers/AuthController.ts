import type { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthTypes } from '@/types/queries'
import { AuthService } from '@/api/services'


export class AuthController {
   static async registration(request: FastifyRequest<{ Body: AuthTypes.UserRegistrationBody }>, reply: FastifyReply) {
      try {
         const user = request.body;
         const userData = await AuthService.registration(user);

         reply.setCookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
         });

         return userData;
      } catch (e) {
         throw e;
      }
   }

   static async login(request: FastifyRequest<{ Body: AuthTypes.UserLoginBody }>, reply: FastifyReply) {
      try {
         const user = request.body;
         const userData = await AuthService.login(user);

         reply.setCookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
         });

         return userData;
      } catch (e) {
         throw e;
      }
   }

   static async logout(request: FastifyRequest, reply: FastifyReply) {
      try {
         const { refreshToken } = request.cookies;
         const token = await AuthService.logout(refreshToken);

         reply.clearCookie('refreshToken');
         return token;
      } catch (e) {
         throw e;
      }
   }

   static async refresh(request: FastifyRequest, reply: FastifyReply) {
      try {
         const { refreshToken } = request.cookies;
         const userData = await AuthService.refresh(refreshToken);

         reply.setCookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
         });

         return userData;
      } catch (e) {
         throw e;
      }
   }

   static async activate(request: FastifyRequest<{ Params: AuthTypes.UserActivateParams }>, reply: FastifyReply) {
      try {
         const { link } = request.params;
         await AuthService.activate(link);
         return reply.redirect(process.env.CLIENT_URL.split(' ')[0]);
      } catch (e) {
         throw e;
      }
   }

   static async restorePassword(request: FastifyRequest<{ Body: AuthTypes.UserPasswordRestoreBody }>, reply: FastifyReply) {
      try {
         const { email } = request.body;
         const message = await AuthService.restorePassword(email);
         return message;
      } catch (e) {
         throw e;
      }
   }

   static async setNewRestoredPassword(request: FastifyRequest<{ Body: AuthTypes.UserNewRestoredPasswordBody }>, reply: FastifyReply) {
      try {
         const { password, link } = request.body;
         const message = await AuthService.setNewRestoredPassword(password, link);
         return message;
      } catch (e) {
         throw e;
      }
   }
}