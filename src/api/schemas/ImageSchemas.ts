import type { ImageTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ImageSchemas {
  static readonly index = {
    querystring: Joi.object<ImageTypes.GetImages['Querystring']>()
      .keys({
        skip: Joi.number().required(),
        limit: Joi.number().min(1).required(),
        descending: Joi.boolean(),
        sort: Joi.string(),
      })
      .required(),
  };

  static readonly delete = {
    body: Joi.array<string[]>().items(Joi.string()).required(),
  };

  static readonly update = {
    body: Joi.object<ImageTypes.UpdateDescription['Body']>()
      .keys({ description: Joi.string().max(50) })
      .required(),
    params: Joi.object<ImageTypes.UpdateDescription['Params']>().keys({ id: Joi.string().required() }).required(),
  };
}
