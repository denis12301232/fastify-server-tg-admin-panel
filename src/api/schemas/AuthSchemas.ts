import type { AuthTypes } from '@/types/index.js';
import Joi from 'joi';
import { Validate } from '@/util/index.js';

export default class AuthSchemas {
  static readonly userRegistration = {
    body: Joi.object<AuthTypes.UserRegistration['Body']>()
      .keys({
        login: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string()
          .required()
          .custom((value, helper) => {
            return Validate.isEmail(value) ? value : helper.error('any.invalid');
          }),
        password: Joi.string().required().min(6).max(20),
      })
      .required(),
  };

  static readonly userLogin = {
    body: Joi.object<AuthTypes.UserLogin['Body']>()
      .keys({
        loginOrEmail: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required(),
  };

  static readonly userActivate = {
    params: Joi.object<AuthTypes.UserActivate['Params']>()
      .keys({
        link: Joi.string().required(),
      })
      .required(),
  };

  static readonly userPasswordRestore = {
    body: Joi.object<AuthTypes.UserPasswordRestore['Body']>()
      .keys({
        email: Joi.string()
          .required()
          .custom((value, helper) => {
            return Validate.isEmail(value) ? value : helper.error('any.invalid');
          }),
      })
      .required(),
  };

  static readonly userNewRestoredPassword = {
    body: Joi.object<AuthTypes.UserNewRestoredPassword['Body']>()
      .keys({
        password: Joi.string().min(6).max(20),
        link: Joi.string().required(),
      })
      .required(),
  };
}
