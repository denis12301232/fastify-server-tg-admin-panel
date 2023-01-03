import type { AuthTypes } from '@/types/queries'
import Joi from 'joi'
import Validate from '@/util/Validate'


export class AuthSchemas {
   static readonly userRegistrationBody = {
      body: Joi.object<AuthTypes.UserRegistrationBody>().keys({
         name: Joi.string().required(),
         email: Joi.string().required().custom((value, helper) => {
            return Validate.isEmail(value) ? value : helper.error('any.invalid');
         }),
         password: Joi.string().min(6).max(20)
      }).required()
   }

   static readonly userLoginBody = {
      body: Joi.object<AuthTypes.UserLoginBody>().keys({
         email: Joi.string().required().custom((value, helper) => {
            return Validate.isEmail(value) ? value : helper.error('any.invalid');
         }),
         password: Joi.string().min(6).max(20)
      }).required()
   }

   static readonly userActivateParams = {
      params: Joi.object<AuthTypes.UserActivateParams>().keys({
         link: Joi.string().required()
      }).required()
   }

   static readonly userPasswordRestoreBody = {
      body: Joi.object<AuthTypes.UserPasswordRestoreBody>().keys({
         email: Joi.string().required().custom((value, helper) => {
            return Validate.isEmail(value) ? value : helper.error('any.invalid');
         }),
      }).required()
   }

   static readonly userNewRestoredPasswordBody = {
      body: Joi.object<AuthTypes.UserNewRestoredPasswordBody>().keys({
         password: Joi.string().min(6).max(20),
         link: Joi.string().required()
      }).required()
   }
}