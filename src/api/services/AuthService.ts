import type { AuthTypes } from '@/types/queries'
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import { UserModel, RestoreModel } from '@/models/mongo'
import { UserDto } from '@/dto'
import { MailService, TokenService } from '@/api/services'
import ApiError from '@/exeptions/ApiError'


export class AuthService {
   static async registration(user: AuthTypes.UserRegistrationBody) {
      const { login, name, email, password } = user;
      const candidate = await UserModel.findOne({
         $or: [
            { email: email.toLowerCase() },
            { login: login.toLowerCase() }
         ]
      }).lean();

      if (candidate) {
         throw ApiError.BadRequest(400, `Already taken`, [candidate.email === email ? 'email' : 'login']);
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const activationLink = v4();
      const newUser = await UserModel.create({
         login: login.toLowerCase(),
         email: email.toLowerCase(),
         password: hashPassword,
         activationLink,
         name
      });
      MailService.sendActivationMail(email, `${process.env.SERVER_URL}/api/auth/activate/${activationLink}`)
         .catch((e: Error) => console.log(e.message));

      const userDto = new UserDto(newUser);
      const tokens = TokenService.generateTokens({ ...userDto });

      await TokenService.saveToken(userDto._id, tokens.refreshToken);

      return { ...tokens, user: userDto };
   }

   static async login(user: AuthTypes.UserLoginBody) {
      const { loginOrEmail, password } = user;
      const userFromDb = await UserModel.findOne({
         $or: [
            { email: loginOrEmail.toLowerCase() },
            { login: loginOrEmail.toLowerCase() }
         ]
      }).lean();

      if (!userFromDb) {
         throw ApiError.BadRequest(400, `Incorrect login or email`, ['login', 'email']);
      }

      const isPasswordsEqual = await bcrypt.compare(password, userFromDb.password);

      if (!isPasswordsEqual) {
         throw ApiError.BadRequest(400, `Incorrect password`, ['password']);
      }

      const userDto = new UserDto(userFromDb);
      const tokens = TokenService.generateTokens({ ...userDto });

      await TokenService.saveToken(userDto._id, tokens.refreshToken);

      return { ...tokens, user: userDto };
   }

   static async logout(refreshToken: string | undefined) {
      if (!refreshToken) {
         throw ApiError.Unauthorized();
      }
      const token = await TokenService.removeToken(refreshToken);
      return token;
   }

   static async refresh(refreshToken: string | undefined) {
      if (!refreshToken) {
         throw ApiError.Unauthorized();
      }

      const userData = TokenService.validateRefreshToken<UserDto>(refreshToken);
      const tokenFromDb = await TokenService.findToken(refreshToken);

      if (!userData || !tokenFromDb) {
         throw ApiError.Unauthorized();
      }


      const user = await UserModel.findById(userData._id);

      if (!user) {
         throw ApiError.BadRequest(400, `User not found`);
      }

      const userDto = new UserDto(user);
      const tokens = TokenService.generateTokens({ ...userDto });

      await TokenService.saveToken(userDto._id, tokens.refreshToken);
      return { ...tokens, user: userDto };
   }

   static async activate(activationLink: string) {
      const user = await UserModel.findOne({ activationLink });

      if (!user) {
         throw ApiError.BadRequest(400, `Activation link is incorrect`);
      }

      user.isActivated = true;
      await user.save();
   }

   static async restorePassword(email: string) {
      const link = v4();
      const user = await UserModel.findOne({ email }).lean();

      if (!user) {
         throw ApiError.BadRequest(400, `Incorrect email`, ['email']);
      }

      const restoreData = await RestoreModel.findOne({ user: user._id });
      const dateNow = new Date;

      if (restoreData) {
         restoreData.restoreLink = link;
         restoreData.createdAt = dateNow;
         await restoreData.save();
      } else {
         await RestoreModel.create({ user: user._id, restoreLink: link, createdAt: dateNow });
      }

      await MailService.sendRestoreMail(email, `${process.env.SERVER_URL}/restore?link=${link}`)
         .catch(e => {
            throw ApiError.BadRequest(400, `Message sending error`);
         });

      return { message: `Link was sent to email` };
   }

   static async setNewRestoredPassword(password: string, link: string) {
      const restoreData = await RestoreModel.findOne({ restoreLink: link });
      const date = new Date();

      if (!restoreData || (+date - +restoreData.createdAt > 6048e5)) {
         throw ApiError.BadRequest(400, 'Link expired');
      }

      const hashPassword: string = await bcrypt.hash(password, 5);
      const userData = await UserModel.findById(restoreData.user);

      if (!userData) {
         throw ApiError.BadRequest();
      }

      userData.password = hashPassword;
      await userData.save();
      await restoreData.delete();

      return { message: 'Password was changed' }
   }
}