import type { FastifyRequest, FastifyInstance } from 'fastify';
import type { ImageTypes } from '@/types/index.js';
import { ImageService } from '@/api/services/index.js';

export default class ImagesController {
  static async index(request: FastifyRequest<ImageTypes.GetImages>) {
    const result = await ImageService.getImages(request.query);
    return result;
  }

  static async store(request: FastifyRequest) {
    const parts = request.files({ limits: { files: 100, fileSize: 10e6, fieldSize: 10e6 } });
    const result = await ImageService.uploadToS3(parts);
    return result;
  }

  static async destroy(request: FastifyRequest<ImageTypes.DeleteImages>) {
    const result = await ImageService.deleteFromS3(request.body);
    return result;
  }

  static async update(request: FastifyRequest<ImageTypes.UpdateDescription>) {
    const result = await ImageService.updateDescription(request.params.id, request.body);
    return result;
  }

  static async saveComment(this: FastifyInstance, request: FastifyRequest<ImageTypes.SaveComment>) {
    const result = await ImageService.saveComment(request.params.id, request.user._id, request.body.text);
    return result;
  }
}
