import type { ImageTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ImageSchemas {
  static readonly getImagesQuery = Joi.object<ImageTypes.GetImagesQuery>()
    .keys({
      skip: Joi.number().required(),
      limit: Joi.number().min(1).required(),
      descending: Joi.boolean(),
      sort: Joi.string(),
    })
    .required();

  static readonly deleteImagesBody = Joi.array().items(Joi.string()).required();
  static readonly updateDescriptionBody = Joi.object<ImageTypes.UpdateDescriptionBody>()
    .keys({
      id: Joi.string().required(),
      description: Joi.string().max(50),
    })
    .required();
}
