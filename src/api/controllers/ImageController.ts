import type { FastifyRequest, FastifyReply } from 'fastify'
import type { ImageTypes } from '@/types'
import { ImageService } from '@/api/services'


export class ImagesController {
   static async getImages(request: FastifyRequest<{ Querystring: ImageTypes.GetImagesQuery }>, reply: FastifyReply) {
      const { pageToken } = request.query;
      const result = await ImageService.getImages(pageToken);
      return result;
   }
}