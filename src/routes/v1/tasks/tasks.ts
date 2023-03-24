import type { FastifyInstance } from 'fastify'
import { TaskSchemas } from '@/api/schemas/TaskSchemas'
import { TaskController } from '@/api/controllers/TaskController'
import { useAuthGuard, useRoleGuard, useDeleteTempFile } from '@/hooks'


export default async function MessangerRoutes(fastify: FastifyInstance) {
   fastify.post('/', {
      schema: TaskSchemas.createTaskBody,
      preHandler: [useAuthGuard, useRoleGuard(['admin'])]
   }, TaskController.createTask);

   fastify.get('/', {
      schema: TaskSchemas.getTasksQuery,
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

   fastify.patch('/update_subtask', {
      schema: TaskSchemas.updateSubtaskBody,
      preHandler: useAuthGuard,
   }, TaskController.updateSubtask);

   fastify.delete('/delete_subtask', {
      schema: TaskSchemas.deleteSubtaskQuery,
      preHandler: useAuthGuard,
   }, TaskController.deleteSubtask);

   fastify.patch('/move_subtask', {
      schema: TaskSchemas.moveSubtaskBody,
      preHandler: useAuthGuard,
   }, TaskController.moveSubtask);

   fastify.get('/create_task_csv', {
      schema: TaskSchemas.createTaskCsvQuery,
      preHandler: useAuthGuard,
      onResponse: useDeleteTempFile('subtasksCsv')
   }, TaskController.createTaskCsv);
}