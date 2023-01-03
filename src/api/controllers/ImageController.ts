import { ImageService } from './../services/ImageService'
import type { FastifyRequest, FastifyReply } from 'fastify'
import type { ImageTypes } from '@/types/queries'


export class ImagesController {
   static async getImages(request: FastifyRequest<{ Querystring: ImageTypes.GetImagesQuery }>, reply: FastifyReply) {
      try {
         const { pageToken } = request.query;
         const result = await ImageService.getImages(pageToken);
         return result;
      } catch (e) {
         throw e;
      }
   }
}