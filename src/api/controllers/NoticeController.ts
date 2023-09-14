import type { FastifyRequest, FastifyInstance } from 'fastify';
import type { NoticeTypes } from '@/types/index.js';

export default class NoticeController {
  static async index(this: FastifyInstance, request: FastifyRequest) {
    const result = await this.redis.json.GET('notices', { path: `.${request?.user?._id}` }).catch(() => []);
    return result;
  }

  static async store(this: FastifyInstance, request: FastifyRequest<NoticeTypes.Store>) {
    const isExists = (await this.redis.json
      .GET('notices', { path: `.${request?.user?._id}` })
      .catch(() => [])) as string[];

    isExists?.length
      ? this.redis.json.ARRAPPEND('notices', `.${request?.user?._id}`, request.body)
      : this.redis.json.SET('notices', '$', { [request?.user?._id]: [request.body] });

    return null;
  }

  static async destroy(this: FastifyInstance, request: FastifyRequest<NoticeTypes.Destroy>) {
    const arr = (await this.redis.json
      .GET('notices', { path: `.${request?.user?._id}` })
      .catch(() => [])) as NoticeTypes.Store['Body'][];
    this.redis.json.SET('notices', '$', { [request.user._id]: arr.filter((item) => item.id !== request.params.id) });

    return null;
  }

  static async clear(this: FastifyInstance, request: FastifyRequest) {
    const result = await this.redis.json.DEL('notices', `.${request?.user?._id}`);
    return result;
  }
}
