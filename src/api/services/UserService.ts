import type { FilterQuery } from 'mongoose';
import ApiError from '@/exceptions/ApiError.js';
import Models from '@/models/mongo/index.js';
import { IUser, UserTypes } from '@/types/index.js';

export default class UserService {
  static async getUser(userId: string) {
    const user = await Models.User.findById(userId, { avatar: 1, login: 1, name: 1, roles: 1, status: 1 }).lean();

    if (!user) {
      throw ApiError.NotFound();
    }

    return user;
  }

  static async getUsers(_id: string, { limit, page, filter }: UserTypes.GetUsers['Querystring']) {
    const query: FilterQuery<IUser> = filter
      ? {
          $or: [{ login: { $regex: filter, $options: 'i' } }, { name: { $regex: filter, $options: 'i' } }],
        }
      : {};
    const skip = (page - 1) * limit;
    const [users, count] = await Promise.all([
      Models.User.find(
        { $and: [{ _id: { $ne: _id }, login: { $ne: 'root' } }, query] },
        { _id: 1, login: 1, name: 1, roles: 1 }
      )
        .skip(skip)
        .limit(limit)
        .lean(),
      Models.User.count({ $and: [{ _id: { $ne: _id }, login: { $ne: 'root' } }, query] }),
    ]);

    return { users, count };
  }
}
