import type { FastifyRequest } from 'fastify';
import type { NoticeTypes } from '@/types/index.js';
import { NoticeService } from '@/api/services/index.js';

export default class NoticeController {
  static async index(request: FastifyRequest) {
    const notices = await NoticeService.index(request.user._id);
    return notices;
  }

  static async store(request: FastifyRequest<NoticeTypes.Store>) {
    const result = await NoticeService.store(request.user._id, request.body);
    return result;
  }

  static async update(request: FastifyRequest<NoticeTypes.Update>) {
    const result = await NoticeService.update(request.params.id, request.body);
    return result;
  }

  static async destroy(request: FastifyRequest<NoticeTypes.Destroy>) {
    const result = await NoticeService.destroy(request.params.id);
    return result;
  }

  static async clear(request: FastifyRequest) {
    const result = await NoticeService.clear(request.user._id);
    return result;
  }
}
