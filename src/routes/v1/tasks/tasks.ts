import type { FastifyInstance } from 'fastify';
import TaskSchemas from '@/api/schemas/TaskSchemas.js';
import TaskController from '@/api/controllers/TaskController.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function MessangerRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: TaskSchemas.createTask,
      preHandler: [useAuthGuard, useRoleGuard(['admin'])],
    },
    TaskController.createTask
  );
  app.get(
    '/',
    {
      schema: TaskSchemas.getTasks,
      preHandler: useAuthGuard,
    },
    TaskController.getTasks
  );
  app.patch(
    '/update_task_status',
    {
      schema: TaskSchemas.updateTaskStatus,
      preHandler: useAuthGuard,
    },
    TaskController.updateTaskStatus
  );
  app.get(
    '/get_task_by_id',
    {
      schema: TaskSchemas.getTaskById,
      preHandler: useAuthGuard,
    },
    TaskController.getTaskById
  );
  app.patch(
    '/set_user_for_task',
    {
      schema: TaskSchemas.setUserForTask,
      preHandler: useAuthGuard,
    },
    TaskController.setUserForTask
  );
  app.patch(
    '/update_subtask',
    {
      schema: TaskSchemas.updateSubtask,
      preHandler: useAuthGuard,
    },
    TaskController.updateSubtask
  );
  app.delete(
    '/delete_subtask',
    {
      schema: TaskSchemas.deleteSubtask,
      preHandler: useAuthGuard,
    },
    TaskController.deleteSubtask
  );
  app.patch(
    '/move_subtask',
    {
      schema: TaskSchemas.moveSubtask,
      preHandler: useAuthGuard,
    },
    TaskController.moveSubtask
  );
  app.get(
    '/create_task_csv',
    {
      schema: TaskSchemas.createTaskCsv,
      preHandler: useAuthGuard,
    },
    TaskController.createTaskCsv
  );
}
