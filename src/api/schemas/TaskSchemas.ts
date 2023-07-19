import type { TaskTypes } from '@/types/index.js';
import Joi from 'joi';

export default class TaskSchemas {
  static readonly createTask = {
    body: Joi.object<TaskTypes.CreateTask['Body']>()
      .keys({
        title: Joi.string().required().max(30),
        tags: Joi.array().required().min(1),
        subtasks: Joi.array().items(
          Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
          })
        ),
      })
      .required(),
  };

  static readonly updateTaskStatus = {
    body: Joi.object<TaskTypes.UpdateTaskStatus['Body']>()
      .keys({
        task_id: Joi.string().required(),
        status: Joi.string().required().allow('untaken', 'performed', 'canceled', 'completed'),
      })
      .required(),
  };

  static readonly getTaskById = {
    querystring: Joi.object<TaskTypes.GetTaskById['Querystring']>()
      .keys({
        task_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly setUserForTask = {
    body: Joi.object<TaskTypes.SetUserForTask['Body']>()
      .keys({
        task_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly updateSubtask = {
    body: Joi.object<TaskTypes.UpdateSubtask['Body']>()
      .keys({
        subtask_id: Joi.string().required(),
        status: Joi.string().allow('untaken', 'performed', 'canceled', 'completed'),
        cause: Joi.string(),
      })
      .required(),
  };

  static readonly deleteSubtask = {
    querystring: Joi.object<TaskTypes.DeleteSubtask['Querystring']>()
      .keys({
        subtask_id: Joi.string().required(),
        task_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly moveSubtask = {
    body: Joi.object<TaskTypes.MoveSubtask['Body']>()
      .keys({
        subtask_id: Joi.string().required(),
        task_id: Joi.string().required(),
        new_task_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly getTasks = {
    querystring: Joi.object<TaskTypes.GetTasks['Querystring']>()
      .keys({
        limit: Joi.number().required(),
        page: Joi.number().required().min(1),
        sort: Joi.string().required().allow('createdAt', 'status', 'title'),
        descending: Joi.boolean().required(),
        filter: Joi.string().allow('', 'all', 'my'),
      })
      .required(),
  };

  static readonly createTaskCsv = {
    querystring: Joi.object<TaskTypes.CreateTaskCsv['Querystring']>()
    .keys({
      task_id: Joi.string().required(),
    })
    .required()
  }

}
