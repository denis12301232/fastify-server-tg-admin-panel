import type { UserTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ToolsSchemas {
  static readonly getUser = {
    params: Joi.object<UserTypes.GetUser['Params']>().keys({ id: Joi.string().required() }),
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
}
