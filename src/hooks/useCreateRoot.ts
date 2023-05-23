import Models from '@/models/mongo/index.js';
import { hash } from 'bcrypt';

export async function useCreateRoot() {
  const user = await Models.User.findOne({ login: 'root' }, { email: 1 }).lean();

  if (!user) {
    const hashPassword = await hash('root', 5);
    await Models.User.create({
      name: 'root',
      login: 'root',
      email: 'root',
      password: hashPassword,
      isActivated: true,
      roles: ['user', 'admin'],
    });
  }
}
