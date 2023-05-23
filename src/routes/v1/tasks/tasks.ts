import type { FastifyInstance } from 'fastify';
import TaskSchemas from '@/api/schemas/TaskSchemas.js';
import TaskController from '@/api/controllers/TaskController.js';
import { useAuthGuard, useRoleGuard, useDeleteTempFile } from '@/hooks/index.js';

export default async function MessangerRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: { body: TaskSchemas.createTaskBody },
      preHandler: [useAuthGuard, useRoleGuard(['admin'])],
    },
    TaskController.createTask
  );
  app.get(
    '/',
    {
      schema: { querystring: TaskSchemas.getTasksQuery },
      preHandler: useAuthGuard,
    },
    TaskController.getTasks
  );
  app.patch(
    '/update_task_status',
    {
      schema: { body: TaskSchemas.updateTaskStatusBody },
      preHandler: useAuthGuard,
    },
    TaskController.updateTaskStatus
  );
  app.get(
    '/get_task_by_id',
    {
      schema: { querystring: TaskSchemas.getTaskByIdQuery },
      preHandler: useAuthGuard,
    },
    TaskController.getTaskById
  );
  app.patch(
    '/set_user_for_task',
    {
      schema: { body: TaskSchemas.setUserForTaskBody },
      preHandler: useAuthGuard,
    },
    TaskController.setUserForTask
  );
  app.patch(
    '/update_subtask',
    {
      schema: { body: TaskSchemas.updateSubtaskBody },
      preHandler: useAuthGuard,
    },
    TaskController.updateSubtask
  );
  app.delete(
    '/delete_subtask',
    {
      schema: { querystring: TaskSchemas.deleteSubtaskQuery },
      preHandler: useAuthGuard,
    },
    TaskController.deleteSubtask
  );
  app.patch(
    '/move_subtask',
    {
      schema: { body: TaskSchemas.moveSubtaskBody },
      preHandler: useAuthGuard,
    },
    TaskController.moveSubtask
  );
  app.get(
    '/create_task_csv',
    {
      schema: { querystring: TaskSchemas.createTaskCsvQuery },
      preHandler: useAuthGuard,
      onResponse: useDeleteTempFile('subtasksCsv'),
    },
    TaskController.createTaskCsv
  );
}
