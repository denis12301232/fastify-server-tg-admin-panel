import type { ToolsTypes } from '@/types/queries'
import Joi from 'joi'
import Validate from '@/util/Validate'


export class ToolsSchemas {
   static readonly setNewNameBody = {
      body: Joi.object<ToolsTypes.SetNewNameBody>().keys({
         name: Joi.string().required()
      }).required()
   }

   static readonly setNewEmailBody = {
      body: Joi.object<ToolsTypes.SetNewEmailBody>().keys({
         email: Joi.string().required().custom((value, helper) => {
            return Validate.isEmail(value) ? value : helper.error('any.invalid');
         }).required()
      })
   }

   static readonly setNewPasswordBody = {
      body: Joi.object<ToolsTypes.SetNewPasswordBody>().keys({
         oldPassword: Joi.string().min(6).max(20),
         newPassword: Joi.string().min(6).max(20)
      }).required()
   }

   static readonly setGoogleServiceAccountSettingsBody = {
      body: Joi.object<ToolsTypes.SetGoogleServiceAccountSettingsBody>().keys({
         serviceUser: Joi.string(),
         servicePrivateKey: Joi.string(),
         sheetId: Joi.string(),
         folderId: Joi.string()
      }).or('serviceUser', 'servicePrivateKey', 'sheetId', 'folderId')
   }

   static readonly updateRolesBody = {
      body: Joi.object<ToolsTypes.UpdateRolesBody>().keys({
         _id: Joi.string().required(),
         roles: Joi.array().required().has(['user']).unique().custom((value, helper) => {
            return Validate.isValidRoles(value) ? value : helper.error('any.invalid');
         })
      }).required()
   }
}