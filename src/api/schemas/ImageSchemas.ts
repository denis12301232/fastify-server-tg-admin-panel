import type { ImageTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ImageSchemas {
  static readonly index = {
    querystring: Joi.object<ImageTypes.Index['Querystring']>()
      .keys({
        skip: Joi.number().required(),
        limit: Joi.number().min(1).required(),
        descending: Joi.boolean(),
        sort: Joi.string(),
      })
      .required(),
  };

  static readonly destroy = {
    body: Joi.array<string[]>().items(Joi.string()).required(),
  };

  static readonly update = {
    body: Joi.object<ImageTypes.Update['Body']>()
      .keys({ description: Joi.string().max(50) })
      .required(),
    params: Joi.object<ImageTypes.Update['Params']>().keys({ id: Joi.string().required() }).required(),
  };
}
