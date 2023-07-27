import type { IUser, ToolsTypes } from '@/types/index.js';
import type { FilterQuery } from 'mongoose';
import ApiError from '@/exceptions/ApiError.js';
import Models from '@/models/mongo/index.js';
import { UserDto } from '@/dto/index.js';
import bcrypt from 'bcrypt';
import { Util } from '@/util/index.js';
import { v4 } from 'uuid';

export default class ToolsService {
  static async setNewName(id: string, name: string) {
    const updated = await Models.User.updateOne({ _id: id }, { name }).lean();
    return updated;
  }

  static async setNewEmail(id: string, email: string) {
    const isUsed = await Models.User.findOne({ email }).lean();
    if (isUsed) {
      throw ApiError.BadRequest(400, `This email address already taken`);
    }
    const updated = await Models.User.updateOne({ _id: id }, { email }).lean();
    return updated;
  }

  static async setNewPassword(id: string, newPassword: string, oldPassword: string) {
    const user = await Models.User.findById(id);
    if (!user) {
      throw ApiError.BadRequest(400, `User not found`);
    }
    const isPasswordsEqual = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordsEqual) {
      throw ApiError.BadRequest(400, `Password is incorrect`, ['password']);
    }
    const hashPassword = await bcrypt.hash(newPassword, 5);
    user.password = hashPassword;
    await user.save();

    return { user: new UserDto(user) };
  }

  static async setGoogleServiceAccountSettings(settings: ToolsTypes.SetGoogleServiceAccountSettings['Body']) {
    const { serviceUser, servicePrivateKey, sheetId, folderId } = settings;
    const google = await Models.Tools.findOne({ api: 'google' });

    if (!google) {
      await Models.Tools.create({
        api: 'google',
        settings: {
          serviceUser: serviceUser,
          servicePrivateKey: servicePrivateKey.replace(/\\n/g, '\n'),
          sheetId: sheetId,
          folderId: folderId,
        },
      });
    } else {
      if (serviceUser) google.settings.serviceUser = serviceUser;
      if (servicePrivateKey) google.settings.servicePrivateKey = servicePrivateKey.replace(/\\n/g, '\n');
      if (sheetId) google.settings.sheetId = sheetId;
      if (folderId) google.settings.folderId = folderId;

      google.markModified('settings');
      await google.save();
    }
    return { message: 'Saved' };
  }

  static async getUsers(_id: string, limit: number, page: number, filter: string) {
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

  static async updateRoles(_id: string, roles: string[]) {
    const updated = await Models.User.updateOne({ _id, login: { $ne: 'root' } }, { roles }).lean();
    return updated;
  }

  static async setAvatar(user_id: string, { buffer, ext }: { buffer?: Buffer; ext?: string }) {
    let fileName = '';
    if (buffer && ext) {
      fileName = `${v4()}.${ext}`;
      await Util.createAsyncWriteStream(buffer, '../../static/images/avatars/', fileName);
    }
    const user = await Models.User.findOneAndUpdate(
      { _id: user_id },
      { avatar: fileName },
      { avatar: 1, _id: 0 }
    ).lean();

    if (user?.avatar) {
      await Util.removeFile(`../../static/images/avatars/${user.avatar}`);
    }

    return { avatar: fileName };
  }
}
