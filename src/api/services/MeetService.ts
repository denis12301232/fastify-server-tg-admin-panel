import type { MeetTypes } from '@/types/queries.js';
import Models from '@/models/mongo/index.js';
import ApiError from '@/exceptions/ApiError.js';

export default class MeetService {
  static async create(userId: string, { invited, title }: MeetTypes.Create['Body']) {
    const result = await Models.Meet.create({
      title,
      invited: [userId, ...invited],
      members: [userId],
      roles: new Map().set('admin', [userId]),
    });
    return result;
  }

  static async update(meetId: string, { invited, title }: MeetTypes.Update['Body']) {
    const updated = await Models.Meet.updateOne({ _id: meetId }, { invited, title }).lean();
    return updated;
  }

  static async show(meetId: string) {
    const meet = await Models.Meet.findById(meetId).lean();
    return meet;
  }

  static async join(meetId: string, userId: string) {
    const meet = await Models.Meet.findById(meetId, { invited: 1 }).lean();

    if (!meet?.invited.includes(userId)) {
      throw ApiError.BadRequest();
    }

    const updated = await Models.Meet.updateOne({ _id: meetId }, { $addToSet: { members: userId } }).lean();
    return updated;
  }

  static async leave(meetId: string, userId: string) {
    const updated = await Models.Meet.updateOne({ _id: meetId }, { $pull: { members: userId } }).lean();
    return updated;
  }

  static async destroy(meetId: string) {
    const result = await Models.Meet.deleteOne({ _id: meetId }).lean();
    return result;
  }

  static async invite(meetId: string, users: MeetTypes.Invite['Body']) {
    const [updated, list] = await Promise.all([
      Models.Meet.updateOne({ _id: meetId }, { $addToSet: { invited: { $each: users } } }).lean(),
      Models.User.find({ _id: { $in: users } }, { email: 1 }).lean(),
    ]);

    return { updated, users: list.map((item) => ({ _id: String(item._id), email: item.email })) };
  }
}
