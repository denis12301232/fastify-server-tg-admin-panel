import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import type { TaskTypes } from '@/types/index.js';
import { TaskService } from '@/api/services/index.js';

export default class TaskController {
  static async index(request: FastifyRequest<TaskTypes.GetTasks>, reply: FastifyReply) {
    const { tasks, count } = await TaskService.index(request.user._id, request.query);
    reply.header('X-Total-Count', count);
    return tasks;
  }

  static async store(this: FastifyInstance, request: FastifyRequest<TaskTypes.CreateTask>) {
    const task = await TaskService.store(request.body);

    for (const socket of this.io.sockets.sockets.values()) {
      socket.data.user?._id !== request.user._id && socket.emit('task:create', task);
    }

    return task;
  }

  static async update(request: FastifyRequest<TaskTypes.Update>) {
    const result = await TaskService.update(request.params.id, request.body);
    return result;
  }

  static async show(request: FastifyRequest<TaskTypes.GetTaskById>) {
    const task = await TaskService.show(request.params.id);
    return task;
  }

  static async report(request: FastifyRequest<TaskTypes.Report>, reply: FastifyReply) {
    const stream = await TaskService.createTaskCsv(request.params.id);
    return reply.header('Content-Type', 'application/octet-stream').send(stream);
  }

  static async updateSubtask(request: FastifyRequest<TaskTypes.UpdateSubtask>) {
    const updated = await TaskService.updateSubtask(request.params.id, request.body);
    return updated;
  }

  static async deleteSubtask(request: FastifyRequest<TaskTypes.DeleteSubtask>) {
    const deleted = await TaskService.deleteSubtask(request.params.id, request.query);
    return deleted;
  }

  static async moveSubtask(request: FastifyRequest<TaskTypes.MoveSubtask>) {
    const result = await TaskService.moveSubtask(request.params.id, request.body);
    return result;
  }
}
