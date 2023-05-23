import type { ImageTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ImageSchemas {
  static readonly getImagesQuery = Joi.object<ImageTypes.GetImagesQuery>()
    .keys({
      pageToken: Joi.string(),
    })
    .required();

  static readonly deleteImagesBody = Joi.array().items(Joi.string()).required();
}
