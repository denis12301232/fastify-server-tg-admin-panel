import type { ImageTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ImageSchemas {
  static readonly getImages = {
    querystring: Joi.object<ImageTypes.GetImages['Querystring']>()
      .keys({
        skip: Joi.number().required(),
        limit: Joi.number().min(1).required(),
        descending: Joi.boolean(),
        sort: Joi.string(),
      })
      .required(),
  };

  static readonly deleteImages = {
    body: Joi.array().items(Joi.string()).required(),
  };

  static readonly updateDescription = {
    body: Joi.object<ImageTypes.UpdateDescription['Body']>()
      .keys({
        id: Joi.string().required(),
        description: Joi.string().max(50),
      })
      .required(),
  };
}
