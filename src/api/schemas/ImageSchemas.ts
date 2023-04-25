import type { ImageTypes } from '@/types'
import Joi from 'joi'


export class ImageSchemas {
   static readonly getImagesBody = {
      querystring: Joi.object<ImageTypes.GetImagesQuery>().keys({
         pageToken: Joi.string()
      }).required()
   }

   static readonly deleteImagesBody = {
      body: Joi.array().items(Joi.string()).required()
   }
}