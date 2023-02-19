import type { MultipartFile } from '@fastify/multipart'
import ApiError from '@/exeptions/ApiError'
import { UserModel, ToolsModel } from '@/models/mongo'
import { UserDto } from '@/dto/UserDto'
import bcrypt from 'bcrypt'
import { Util } from '@/util'


export class ToolsService {
   static async setNewName(id: string, name: string) {
      const user = await UserModel.findById(id);

      if (!user) throw ApiError.BadRequest(400, `User not found`);

      user.name = name;
      await user.save();

      return { user: new UserDto(user) };
   }

   static async setNewEmail(id: string, email: string) {
      const isUsed = await UserModel.findOne({ email });

      if (isUsed) throw ApiError.BadRequest(400, `This email address already taken`);

      const user = await UserModel.findById(id);

      if (!user || user.email === 'root@root.root') {
         throw ApiError.BadRequest(400, `User not found`, user ? ['root'] : undefined);
      }

      user.email = email;
      await user.save();

      return { user: new UserDto(user) };
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

   static async setGoogleServiceAccountSettings(settings: { serviceUser: string, servicePrivateKey: string, sheetId: string, folderId: string }) {
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

   static async getUsers(_id: string, limit: number, page: number) {
      const skip = (page - 1) * limit;
      const users = await UserModel.find(
         { _id: { $ne: _id }, login: { $ne: 'root' } },
         { _id: 1, login: 1, name: 1, roles: 1 }
      )
         .skip(skip)
         .limit(limit)
         .lean();
      const count = await UserModel.count() - 1;
      return { users, count };
   }

   static async updateRoles(_id: string, roles: string[]) {
      const user = await UserModel.findOne({ _id });

      if (!user || user.login === 'root') {
         throw ApiError.BadRequest(400, 'User not found');
      }

      user.roles = roles;
      await user.save();
      return { message: 'Updated' };
   }

   static async setAvatar(data: MultipartFile, user_id: string) {
      const fileName = `${user_id}.${data.filename.split('.').reverse()[0]}`;
      const buffer = await data.toBuffer();
      await Util.createAsyncWriteStream(buffer, '../../static/images/avatars/', fileName);
      const result = await UserModel.updateOne({ _id: user_id }, { avatar: fileName })
         .lean();
      return result;
   }
}