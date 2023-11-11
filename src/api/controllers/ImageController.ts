import type { FastifyRequest } from 'fastify';
import type { ImageTypes } from '@/types/index.js';
import { ImageService } from '@/api/services/index.js';

export default class ImagesController {
  static async index(request: FastifyRequest<ImageTypes.Index>) {
    const result = await ImageService.index(request.query);
    return result;
  }

  static async store(request: FastifyRequest) {
    const parts = request.files({ limits: { files: 100, fileSize: 10e6, fieldSize: 10e6 } });
    const result = await ImageService.store(parts);
    return result;
  }

  static async destroy(request: FastifyRequest<ImageTypes.Destroy>) {
    const result = await ImageService.destroy(request.body);
    return result;
  }

  static async update(request: FastifyRequest<ImageTypes.Update>) {
    const result = await ImageService.update(request.params.id, request.body);
    return result;
  }
}
