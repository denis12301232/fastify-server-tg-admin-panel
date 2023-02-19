import type { FastifyRequest, FastifyReply } from 'fastify'
import type { TaskTypes } from '@/types/queries'
import { TaskService } from '@/api/services'


export class TaskController {
   static async createTask(request: FastifyRequest<{ Body: TaskTypes.CreateTaskBody }>) {
      const { title, tags, description, date } = request.body;
      const task = await TaskService.createTask(title, tags, description, date);
      return task;
   }

   static async getTasks(request: FastifyRequest) {
      const tasks = await TaskService.getTasks();
      return tasks;
   }

   static async updateTaskStatus(request: FastifyRequest<{ Body: TaskTypes.UpdateTaskStatusBody }>) {
      const { task_id, status } = request.body;
      const updated = await TaskService.updateTaskStatusBody(task_id, status);
      return updated;
   }

   static async getTaskById(request: FastifyRequest<{ Querystring: TaskTypes.GetTaskByIdQuery }>) {
      const { task_id } = request.query;
      const task = await TaskService.getTaskById(task_id);
      return task;
   }

   static async setUserForTask(request: FastifyRequest<{ Body: TaskTypes.SetUserForTaskBody }>) {
      const _id = request.user._id;
      const { task_id } = request.body;
      const updated = await TaskService.setUserForTask(_id, task_id);
      return updated;
   }
}