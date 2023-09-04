import type { UserTypes } from '@/types/index.js';
import Joi from 'joi';

export default class UserSchemas {
  static readonly getUser = {
    params: Joi.object<UserTypes.GetUser['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly getUsers = {
    querystring: Joi.object<UserTypes.GetUsers['Querystring']>()
      .keys({
        limit: Joi.number().required().max(50),
        page: Joi.number().required().min(1),
        filter: Joi.string().allow(''),
      })
      .required(),
  };

  static readonly updateName = {
    body: Joi.object<UserTypes.UpdateName['Body']>().keys({ name: Joi.string().required() }).required(),
  };

  static readonly updateEmail = {
    body: Joi.object<UserTypes.UpdateEmail['Body']>()
      .keys({ email: Joi.string().required().email().required() })
      .required(),
  };

  static readonly updatePassword = {
    body: Joi.object<UserTypes.UpdatePassword['Body']>()
      .keys({
        oldPassword: Joi.string().required().max(20),
        newPassword: Joi.string().required().min(6).max(20),
      })
      .required(),
  };

  static readonly updateRoles = {
    body: Joi.object<UserTypes.UpdateRoles['Body']>()
      .keys({
        _id: Joi.string().required(),
        roles: Joi.array().required().has(['user']).unique().allow('user', 'admin'),
      })
      .required(),
  };
}
