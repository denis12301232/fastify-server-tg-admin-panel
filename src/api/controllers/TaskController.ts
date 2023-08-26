import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { TaskTypes } from '@/types/index.js';
import { TaskService } from '@/api/services/index.js';

export default class TaskController {
  static async createTask(this: FastifyInstance, request: FastifyRequest<TaskTypes.CreateTask>) {
    const { title, tags, subtasks } = request.body;
    const task = await TaskService.createTask({ title, tags, subtasks });

    for (const socket of this.io.sockets.sockets.values()) {
      socket.data.user?._id !== request.user._id && socket.emit('task:create', task);
    }

    return task;
  }

  static async getTasks(request: FastifyRequest<TaskTypes.GetTasks>, reply: FastifyReply) {
    const _id = request.user._id;
    const { tasks, count } = await TaskService.getTasks(request.query, _id);
    reply.header('X-Total-Count', count);
    return tasks;
  }

  static async updateTaskStatus(request: FastifyRequest<TaskTypes.UpdateTaskStatus>) {
    const { taskId, status } = request.body;
    const updated = await TaskService.updateTaskStatus(taskId, status);
    return updated;
  }

  static async getTaskById(request: FastifyRequest<TaskTypes.GetTaskById>) {
    const { id } = request.params;
    const task = await TaskService.getTaskById(id);
    return task;
  }

  static async setUserForTask(request: FastifyRequest<TaskTypes.SetUserForTask>) {
    const _id = request.user._id;
    const { taskId } = request.body;
    const updated = await TaskService.setUserForTask(_id, taskId);
    return updated;
  }

  static async updateSubtask(request: FastifyRequest<TaskTypes.UpdateSubtask>) {
    const { subtask_id, status, cause } = request.body;
    const updated = await TaskService.updateSubtask(subtask_id, status, cause);
    return updated;
  }

  static async deleteSubtask(request: FastifyRequest<TaskTypes.DeleteSubtask>) {
    const { subtask_id, taskId } = request.query;
    const deleted = await TaskService.deleteSubtask(subtask_id, taskId);
    return deleted;
  }

  static async moveSubtask(request: FastifyRequest<TaskTypes.MoveSubtask>) {
    const result = await TaskService.moveSubtask(request.body);
    return result;
  }

  static async createTaskCsv(request: FastifyRequest<TaskTypes.CreateTaskCsv>, reply: FastifyReply) {
    const { taskId } = request.query;
    const stream = await TaskService.createTaskCsv(taskId);
    return reply.header('Content-Type', 'application/octet-stream').send(stream);
  }
}
