import type { FilterQuery } from 'mongoose';
import type { MultipartFile } from '@fastify/multipart';
import ApiError from '@/exceptions/ApiError.js';
import Models from '@/models/mongo/index.js';
import { IUser, UserTypes } from '@/types/index.js';
import { fileTypeFromBuffer } from 'file-type';
import { v4 } from 'uuid';
import S3Service from './S3Service.js';
import { join } from 'path';
import { compare, hash } from 'bcrypt';

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

  static async updateEmail(id: string, email: string) {
    const updated = await Models.User.updateOne({ _id: id }, { email }).lean();
    return updated;
  }

  static async updateName(id: string, name: string) {
    const updated = await Models.User.updateOne({ _id: id }, { name }).lean();
    return updated;
  }

  static async updateAvatar(id: string, data?: MultipartFile) {
    let avatar: string | undefined;
    let fileName = '';

    if (!data?.file) {
      const updated = await Models.User.findOneAndUpdate({ _id: id }, { avatar: '' }).lean();
      avatar = updated?.avatar;
    } else {
      const buffer = await data.toBuffer();
      const validate = await fileTypeFromBuffer(buffer);

      if (!validate?.mime.includes('image')) {
        throw ApiError.BadRequest(400, 'Wrong file type');
      }

      const ext = data.filename.split('.').at(-1);
      fileName = `${v4()}.${ext}`;

      const [updated] = await Promise.all([
        Models.User.findOneAndUpdate({ _id: id }, { avatar: fileName }, { avatar: 1, _id: 0 }).lean(),
        S3Service.uploadFile(buffer, S3Service.IMAGE_FOLDER, fileName),
      ]);
      avatar = updated?.avatar;
    }

    if (avatar) {
      const oldFile = avatar.split('/').at(-1) || '';
      S3Service.deleteFiles([{ Key: join(S3Service.IMAGE_FOLDER, oldFile) }]).catch((e) => console.log(e));
    }
    return { avatar: fileName };
  }

  static async updatePassword(id: string, { newPassword, oldPassword }: UserTypes.UpdatePassword['Body']) {
    const user = await Models.User.findById(id).lean();

    if (!user) {
      throw ApiError.BadRequest(400, `User not found`);
    }

    const isPasswordsEqual = await compare(oldPassword, user.password);

    if (!isPasswordsEqual) {
      throw ApiError.BadRequest(400, `Password is incorrect`, ['password']);
    }

    const hashPassword = await hash(newPassword, 5);
    const updated = await Models.User.updateOne({ _id: id }, { password: hashPassword }).lean();
    return updated;
  }

  static async updateRoles(id: string, { _id, roles }: UserTypes.UpdateRoles['Body']) {
    if (_id === id) {
      throw ApiError.BadRequest(400, 'Wrong query');
    }

    const updated = await Models.User.updateOne({ _id, login: { $ne: 'root' } }, { roles }).lean();
    return updated;
  }
}
