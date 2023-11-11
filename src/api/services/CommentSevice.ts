import type { CommentTypes, IUser } from '@/types/index.js';
import Models from '@/models/mongo/index.js';

export default class CommentService {
  static async store(user: string, { mediaId: media, text }: CommentTypes.Store['Body']) {
    const comment = await Models.Commment.create({ media, text, user });
    await Models.Media.updateOne({ _id: media }, { $addToSet: { comments: comment.id } }).lean();

    return comment;
  }

  static async index({ mediaId: media, limit, skip, sort, descending }: CommentTypes.Index['Querystring']) {
    const [comments, count] = await Promise.all([
      Models.Commment.find({ media })
        .sort({ [sort]: descending ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .populate<{ user: IUser }>({ path: 'user', select: 'login avatar name' })
        .lean(),
      Models.Commment.find({ media }).count(),
    ]);

    return { comments, count };
  }

  static async update(id: string, { reactions }: CommentTypes.Update['Body']) {
    const updated = await Models.Commment.updateOne({ _id: id }, { reactions }).lean();
    return updated;
  }
}
