import type { FastifyInstance } from 'fastify';
import TaskSchemas from '@/api/schemas/TaskSchemas.js';
import TaskController from '@/api/controllers/TaskController.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function TasksRoutes(app: FastifyInstance) {
  app.get('/', { schema: TaskSchemas.index, preHandler: useAuthGuard }, TaskController.index);
  app.post(
    '/',
    { schema: TaskSchemas.store, preHandler: [useAuthGuard, useRoleGuard(['admin'])] },
    TaskController.store
  );
  app.patch('/:id', { schema: TaskSchemas.update, preHandler: useAuthGuard }, TaskController.update);
  app.get('/:id', { schema: TaskSchemas.show, preHandler: useAuthGuard }, TaskController.show);
  app.get('/report/:id', { schema: TaskSchemas.report, preHandler: useAuthGuard }, TaskController.report);
  app.patch(
    '/subtasks/:id',
    { schema: TaskSchemas.updateSubtask, preHandler: useAuthGuard },
    TaskController.updateSubtask
  );
  app.delete(
    '/subtasks/:id',
    { schema: TaskSchemas.deleteSubtask, preHandler: useAuthGuard },
    TaskController.deleteSubtask
  );
  app.patch(
    '/subtasks/move/:id',
    { schema: TaskSchemas.moveSubtask, preHandler: useAuthGuard },
    TaskController.moveSubtask
  );
}
