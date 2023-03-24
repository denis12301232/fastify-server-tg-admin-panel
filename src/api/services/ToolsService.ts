import type { MultipartFile } from '@fastify/multipart'
import type { ToolsTypes } from '@/types'
import ApiError from '@/exeptions/ApiError'
import { UserModel, ToolsModel } from '@/models/mongo'
import { UserDto } from '@/dto'
import bcrypt from 'bcrypt'
import { Util, Validate } from '@/util'
import { v4 } from 'uuid'


export default class ToolsService {
   static async setNewName(id: string, name: string) {
      const updated = await UserModel.updateOne({ _id: id }, { name }).lean();
      return updated;
   }

   static async setNewEmail(id: string, email: string) {
      const isUsed = await UserModel.findOne({ email }).lean();
      if (isUsed) {
         throw ApiError.BadRequest(400, `This email address already taken`);
      }
      const updated = await UserModel.updateOne({ _id: id }, { email }).lean();
      return updated;
   }

   static async setNewPassword(id: string, newPassword: string, oldPassword: string) {
      const user = await UserModel.findById(id);
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

   static async setGoogleServiceAccountSettings(settings: ToolsTypes.SetGoogleServiceAccountSettingsBody) {
      const { serviceUser, servicePrivateKey, sheetId, folderId } = settings;
      const google = await ToolsModel.findOne({ api: 'google' });

      if (!google) {
         await ToolsModel.create({
            api: 'google', settings: {
               serviceUser: serviceUser,
               servicePrivateKey: servicePrivateKey.replace(/\n/g, '\n'),
               sheetId: sheetId,
               folderId: folderId
            }
         });
      } else {
         if (serviceUser)
            google.settings.serviceUser = serviceUser;
         if (servicePrivateKey)
            google.settings.servicePrivateKey = servicePrivateKey;
         if (sheetId)
            google.settings.sheetId = sheetId;
         if (folderId)
            google.settings.folderId = folderId;

         google.markModified('settings');
         await google.save();
      }

      return { message: 'Saved' }
   }

   static async getUsers(_id: string, limit: number, page: number, filter: string) {
      const query = filter
         ? {
            $or: [
               { login: { $regex: filter, $options: 'i' } },
               { name: { $regex: filter, $options: 'i' } },
            ]
         }
         : {};
      const skip = (page - 1) * limit;
      const users = await UserModel.find(
         { _id: { $ne: _id }, login: { $ne: 'root' }, ...query },
         { _id: 1, login: 1, name: 1, roles: 1 }
      )
         .lean();


      const count = users.length;
      users.splice(0, skip);
      users.length > limit && (users.length = limit);
      return { users, count };
   }

   static async updateRoles(_id: string, roles: string[]) {
      const updated = await UserModel.updateOne({ _id, login: { $ne: 'root' } }, { roles })
         .lean()
      return updated;
   }

   static async setAvatar(user_id: string, avatar?: MultipartFile) {
      let fileName = '';
      if (avatar) {
         const allowedFiles = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
         if (!Validate.isValidMime(allowedFiles)(avatar.mimetype)) {
            throw ApiError.BadRequest(400, 'Wrong query');
         }
         fileName = `${v4()}.${avatar.filename.split('.').at(-1)}`;
         await Util.pipeStreamAsync(avatar.file, '../../static/images/avatars/', fileName);
      }
      const user = await UserModel.findOneAndUpdate({ _id: user_id }, { avatar: fileName }, { avatar: 1, _id: 0 })
         .lean();

      if (user?.avatar) {
         await Util.removeFile(`../../static/images/avatars/${user.avatar}`);
      }

      return { avatar: fileName };
   }
}