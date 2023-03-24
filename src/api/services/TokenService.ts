import jwt from 'jsonwebtoken'
import { UserDto } from '@/dto'
import { TokenModel } from '@/models/mongo'


export default class TokenService {
   static generateTokens(payload: UserDto) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
      return { accessToken, refreshToken };
   }

   static async saveToken(userId: string, refreshToken: string) {
      const tokenData = await TokenModel.findOne({ user: userId });

      if (tokenData) {
         tokenData.refreshToken = refreshToken;
         return tokenData.save();
      }

      const token = await TokenModel.create({ user: userId, refreshToken });
      return token;
   }

   static async removeToken(refreshToken: string) {
      const tokenData = await TokenModel.deleteOne({ refreshToken });
      return tokenData;
   }

   static validateAccessToken<T>(token: string) {
      try {
         const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
         return userData as T;
      } catch (e) {
         return false;
      }
   }

   static validateRefreshToken<T>(token: string) {
      try {
         const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
         return userData as T;
      } catch (e) {
         return false;
      }
   }

   static async findToken(refreshToken: string) {
      const tokenData = await TokenModel.findOne({ refreshToken });
      return tokenData;
   }
}

