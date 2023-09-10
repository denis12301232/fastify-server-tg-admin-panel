import type { FastifyInstance } from 'fastify';
import UserController from '@/api/controllers/UserController.js';
import UserSchemas from '@/api/schemas/UserSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function UserRoutes(app: FastifyInstance) {
  app.get('/', { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: UserSchemas.index }, UserController.index);
  app.get('/:id', { onRequest: [useAuthGuard], schema: UserSchemas.show }, UserController.show);
  app.patch('/email', { onRequest: useAuthGuard, schema: UserSchemas.updateEmail }, UserController.updateEmail);
  app.patch('/name', { onRequest: useAuthGuard, schema: UserSchemas.updateName }, UserController.updateName);
  app.patch('/avatar', { onRequest: useAuthGuard }, UserController.updateAvatar);
  app.patch(
    '/password',
    { onRequest: useAuthGuard, schema: UserSchemas.updatePassword },
    UserController.updatePassword
  );
  app.patch(
    '/roles',
    { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: UserSchemas.updateRoles },
    UserController.updateRoles
  );
}
