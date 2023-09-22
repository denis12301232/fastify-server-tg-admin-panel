import type { AuthTypes } from '@/types/index.js';
import Joi from 'joi';

export default class AuthSchemas {
  static readonly registration = {
    body: Joi.object<AuthTypes.Registration['Body']>()
      .keys({
        login: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(20),
      })
      .required(),
  };

  static readonly login = {
    body: Joi.object<AuthTypes.Login['Body']>()
      .keys({
        loginOrEmail: Joi.string().required(),
        password: Joi.string().required(),
      })
      .required(),
  };

  static readonly activate = {
    params: Joi.object<AuthTypes.Activate['Params']>().keys({ link: Joi.string().required() }).required(),
  };

  static readonly restorePassword = {
    body: Joi.object<AuthTypes.RestorePassword['Body']>().keys({ email: Joi.string().required().email() }).required(),
  };

  static readonly setNewPassword = {
    body: Joi.object<AuthTypes.SetNewPassword['Body']>()
      .keys({
        password: Joi.string().min(6).max(20),
        link: Joi.string().required(),
      })
      .required(),
  };
}
