import type { NoticeTypes } from '@/types/queries.js';
import Models from '@/models/mongo/index.js';

export default class NotiveService {
  static async index(userId: string) {
    const notices = await Models.Notice.find({ user: userId }).lean();
    return notices;
  }

  static async store(userId: string, data: NoticeTypes.Store['Body']) {
    const notice = await Models.Notice.create({ user: userId, ...data });
    return notice;
  }

  static async update(_id: string, { show }: NoticeTypes.Update['Body']) {
    const updated = await Models.Notice.updateOne({ _id }, { show }).lean();
    return updated;
  }

  static async destroy(_id: string) {
    const result = await Models.Notice.deleteOne({ _id }).lean();
    return result;
  }

  static async clear(userId: string) {
    const result = await Models.Notice.deleteMany({ user: userId }).lean();
    return result;
  }
}
