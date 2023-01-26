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

   static async setGoogleServiceAccountSettings(serviceUser: string, servicePrivateKey: string, sheetId: string, folderId: string) {
      const api = await ToolsModel.find().limit(1);
      if (!api.length) {
         const response = await ToolsModel.create({
            api: {
               google: {
                  service: { user: serviceUser, privateKey: servicePrivateKey, sheetId, folderId }
               }
            }
         });
         return response;
      } else {
         if (serviceUser) api[0]!.api!.google!.service!.user = serviceUser;
         if (servicePrivateKey) api[0]!.api!.google!.service!.privateKey = servicePrivateKey.replace(/\\n/g, '\n');
         if (sheetId) api[0]!.api!.google!.service!.sheetId = sheetId;
         if (folderId) api[0]!.api!.google!.service!.folderId = folderId;
         const response = await api[0].save();
         return response;
      }
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
      const ROOT_EMAIL = process.env.ROOT_EMAIL || 'root@root.root';

      if (!user || user.email === ROOT_EMAIL) {
         throw ApiError.BadRequest(400, 'User not found');
      }

      user.roles = roles;
      await user.save();
      return { message: 'Updated' };
   }

   static async setAvatar(data: MultipartFile, user_id: string) {
      const fileName = `${user_id}.${data.filename.split('.').reverse()[0]}`
      await Util.createAsyncWriteStream(await data.toBuffer(), fileName);
      const result = await UserModel.updateOne({ _id: user_id }, { avatar: fileName }).lean();
      return result;
   }
}