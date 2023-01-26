import UserModel from '@/models/mongo/UserModel'
import { hash } from 'bcrypt'


export async function useCreateRoot() {
   const user = await UserModel.findOne({ login: 'root' }, { email: 1 }).lean();

   if (!user) {
      const hashPassword = await hash('root', 5);
      await UserModel.create({
         name: 'root',
         login: 'root',
         email: 'root',
         password: hashPassword,
         isActivated: true,
         roles: ['user', 'admin'],
      });
   }
}