import type { FastifyRequest, FastifyReply } from 'fastify'
import type { ToolsTypes } from '@/types/queries'
import { ToolsService } from '@/api/services'
import ApiError from '@/exeptions/ApiError'


export class ToolsController {
   static async setNewName(request: FastifyRequest<{ Body: ToolsTypes.SetNewNameBody }>, reply: FastifyReply) {
      try {
         const { name } = request.body;
         const _id = request.user?._id;

         if (!_id) {
            throw ApiError.Internal();
         }

         const user = await ToolsService.setNewName(_id, name);
         return user;
      } catch (e) {
         throw e;
      }
   }

   static async setNewEmail(request: FastifyRequest<{ Body: ToolsTypes.SetNewEmailBody }>, reply: FastifyReply) {
      try {
         const { email } = request.body;
         const _id = request.user?._id;

         if (!_id) {
            throw ApiError.Internal();
         }

         const user = await ToolsService.setNewEmail(_id, email);
         return user;
      } catch (e) {
         throw e;
      }
   }

   static async setNewPassword(request: FastifyRequest<{ Body: ToolsTypes.SetNewPasswordBody }>, reply: FastifyReply) {
      try {
         const { newPassword, oldPassword } = request.body;
         const _id = request.user?._id;

         if (!_id) {
            throw ApiError.Internal();
         }

         const user = await ToolsService.setNewPassword(_id, newPassword, oldPassword);
         return user;
      } catch (e) {
         throw e;
      }
   }

   static async setGoogleServiceAccountSettings(request: FastifyRequest<{ Body: ToolsTypes.SetGoogleServiceAccountSettingsBody }>, reply: FastifyReply) {
      try {
         const { serviceUser, servicePrivateKey, sheetId, folderId } = request.body;
         await ToolsService.setGoogleServiceAccountSettings(serviceUser, servicePrivateKey, sheetId, folderId);
         return { message: 'Saved' };
      } catch (e) {
         throw e;
      }
   }

   static async getUsers(request: FastifyRequest<{ Querystring: ToolsTypes.GetUsersQuery }>, reply: FastifyReply) {
      try {
         const _id = request.user?._id!;
         const { limit, page } = request.query;
         const { users, count } = await ToolsService.getUsers(_id, limit, page);
         reply.header('X-Total-Count', count);
         return users;
      } catch (e) {
         throw e;
      }
   }

   static async updateRoles(request: FastifyRequest<{ Body: ToolsTypes.UpdateRolesBody }>, reply: FastifyReply) {
      try {
         const { _id, roles } = request.body;

         if (_id === request.user?._id) {
            throw ApiError.BadRequest(400, 'Wrong query');
         }

         const result = await ToolsService.updateRoles(_id, roles);
         return result;
      } catch (e) {
         throw e;
      }
   }

   static async setAvatar(request: FastifyRequest) {
      const id = request.user?._id!;
      const data = await request.file();

      if (!data) {
         throw ApiError.BadRequest(400, 'Wrong query');
      }
      const result = await ToolsService.setAvatar(data, id);
      return result;
   }
}