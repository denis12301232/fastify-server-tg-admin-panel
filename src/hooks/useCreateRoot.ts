import UserModel from '@/models/mongo/UserModel'
import { hash } from 'bcrypt'


export async function useCreateRoot() {
   const email = process.env.ROOT_EMAIL || 'root@root.root';
   const password = process.env.ROOT_PASSWORD || 'rootroot';
   const user = await UserModel.findOne({ email }, { email: 1 }).lean();

   if (!user) {
      const hashPassword = await hash(password, 5);
      await UserModel.create({
         name: 'root',
         email,
         password: hashPassword,
         isActivated: true,
         roles: ['user', 'admin'],
      });
   }
}