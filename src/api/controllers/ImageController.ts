import type { FastifyRequest } from 'fastify';
import type { ImageTypes } from '@/types/index.js';
import { ImageService } from '@/api/services/index.js';

export default class ImagesController {
  static async getImages(request: FastifyRequest<ImageTypes.GetImages>) {
    const result = await ImageService.getImages(request.query);
    return result;
  }

  static async uploadImages(request: FastifyRequest) {
    const parts = request.files({ limits: { files: 100, fileSize: 10e6, fieldSize: 10e6 } });
    //const result = await ImageService.uploadImages(parts);
    const result = await ImageService.uploadToS3(parts);
    return result;
  }

  static async deleteImages(request: FastifyRequest<ImageTypes.DeleteImages>) {
    const ids = request.body;
    const result = await ImageService.deleteFromS3(ids);
    //const result = await ImageService.deleteImages(ids);
    return result;
  }

  static async updateDescription(request: FastifyRequest<ImageTypes.UpdateDescription>) {
    const { id, description } = request.body;
    const result = await ImageService.updateDescription(id, description);
    return result;
  }
}
