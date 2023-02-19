import type { FastifyInstance } from 'fastify'
import { TaskSchemas } from '@/api/schemas/TaskSchemas'
import { TaskController } from '@/api/controllers/TaskController'
import { useAuthGuard, useRoleGuard } from '@/hooks'


export default async function MessangerRoutes(fastify: FastifyInstance) {
   fastify.post('/create', {
      schema: TaskSchemas.createTaskBody,
      preHandler: [useAuthGuard, useRoleGuard(['admin'])]
   }, TaskController.createTask);

   fastify.get('/', {
      preHandler: useAuthGuard
   }, TaskController.getTasks);

   fastify.patch('/update_task_status', {
      schema: TaskSchemas.updateTaskStatusBody,
      preHandler: useAuthGuard
   }, TaskController.updateTaskStatus);

   fastify.get('/get_task_by_id', {
      schema: TaskSchemas.getTaskByIdQuery,
      preHandler: useAuthGuard,
   }, TaskController.getTaskById);

   fastify.patch('/set_user_for_task', {
      schema: TaskSchemas.setUserForTaskBody,
      preHandler: useAuthGuard,
   }, TaskController.setUserForTask);

}