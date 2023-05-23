import type { FastifyRequest, FastifyReply } from 'fastify';
import type { TaskTypes } from '@/types/index.js';
import { TaskService } from '@/api/services/index.js';
import { createReadStream } from 'fs';

export default class TaskController {
  static async createTask(request: FastifyRequest<{ Body: TaskTypes.CreateTaskBody }>) {
    const { title, tags, subtasks } = request.body;
    const task = await TaskService.createTask({ title, tags, subtasks });
    return task;
  }

  static async getTasks(request: FastifyRequest<{ Querystring: TaskTypes.GetTasksQuery }>, reply: FastifyReply) {
    const _id = request.user._id;
    const { tasks, count } = await TaskService.getTasks(request.query, _id);
    reply.header('X-Total-Count', count);
    return tasks;
  }

  static async updateTaskStatus(request: FastifyRequest<{ Body: TaskTypes.UpdateTaskStatusBody }>) {
    const { task_id, status } = request.body;
    const updated = await TaskService.updateTaskStatus(task_id, status);
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

  static async updateSubtask(request: FastifyRequest<{ Body: TaskTypes.UpdateSubtaskBody }>) {
    const { subtask_id, status, cause } = request.body;
    const updated = await TaskService.updateSubtask(subtask_id, status, cause);
    return updated;
  }

  static async deleteSubtask(request: FastifyRequest<{ Querystring: TaskTypes.DeleteSubtaskQuery }>) {
    const { subtask_id, task_id } = request.query;
    const deleted = await TaskService.deleteSubtask(subtask_id, task_id);
    return deleted;
  }

  static async moveSubtask(request: FastifyRequest<{ Body: TaskTypes.MoveSubtaskBody }>) {
    const result = await TaskService.moveSubtask(request.body);
    return result;
  }

  static async createTaskCsv(
    request: FastifyRequest<{ Querystring: TaskTypes.CreateTaskCsvQuery }>,
    reply: FastifyReply
  ) {
    const { task_id } = request.query;
    const file = await TaskService.createTaskCsv(task_id);
    const stream = createReadStream(file, 'utf-8');
    reply.temp = { subtasksCsv: file };
    return reply.header('Content-Type', 'application/octet-stream').send(stream);
  }
}
