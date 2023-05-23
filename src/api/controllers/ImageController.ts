import type { FastifyRequest } from 'fastify'
import type { ImageTypes } from '@/types/index.js'
import { ImageService } from '@/api/services/index.js'


export default class ImagesController {
   static async getImages(request: FastifyRequest<{ Querystring: ImageTypes.GetImagesQuery }>) {
      const { pageToken } = request.query;
      const result = await ImageService.getImages(pageToken);
      return result;
   }

   static async uploadImages(request: FastifyRequest) {
      const parts = request.files();
      const result = await ImageService.uploadImages(parts);
      return result
   }

   static async deleteImages(request: FastifyRequest<{ Body: ImageTypes.DeleteImagesBody }>) {
      const ids = request.body;
      const result = await ImageService.deleteImages(ids);
      return result;
   }
}