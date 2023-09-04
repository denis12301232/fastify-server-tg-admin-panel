import type { FastifyInstance } from 'fastify';
import UserController from '@/api/controllers/UserController.js';
import UserSchemas from '@/api/schemas/UserSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function UserRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: UserSchemas.getUsers },
    UserController.index
  );
  app.get('/:id', { onRequest: [useAuthGuard], schema: UserSchemas.getUser }, UserController.show);
}
