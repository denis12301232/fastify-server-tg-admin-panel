import type { TaskTypes } from '@/types/index.js';
import Joi from 'joi';

export default class TaskSchemas {
  static readonly index = {
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

  static readonly store = {
    body: Joi.object<TaskTypes.CreateTask['Body']>()
      .keys({
        title: Joi.string().required().max(30),
        tags: Joi.array().required().min(1),
        subtasks: Joi.array<TaskTypes.CreateTask['Body']['subtasks']>().items(
          Joi.object<TaskTypes.CreateTask['Body']['subtasks']['0']>().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
          })
        ),
      })
      .required(),
  };

  static readonly update = {
    body: Joi.object<TaskTypes.Update['Body']>()
      .keys({ status: Joi.string(), userId: Joi.string() })
      .or('status', 'userId'),
    params: Joi.object<TaskTypes.Update['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly show = {
    params: Joi.object<TaskTypes.GetTaskById['Params']>()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  };

  static readonly report = {
    params: Joi.object<TaskTypes.Report['Params']>()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
  };

  static readonly updateSubtask = {
    body: Joi.object<TaskTypes.UpdateSubtask['Body']>()
      .keys({
        status: Joi.string().allow('untaken', 'performed', 'canceled', 'completed'),
        cause: Joi.string(),
      })
      .required(),
    params: Joi.object<TaskTypes.UpdateSubtask['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly deleteSubtask = {
    querystring: Joi.object<TaskTypes.DeleteSubtask['Querystring']>()
      .keys({ taskId: Joi.string().required() })
      .required(),
    params: Joi.object<TaskTypes.DeleteSubtask['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly moveSubtask = {
    body: Joi.object<TaskTypes.MoveSubtask['Body']>()
      .keys({ taskId: Joi.string().required(), newTaskId: Joi.string().required() })
      .required(),
    params: Joi.object<TaskTypes.MoveSubtask['Params']>().keys({ id: Joi.string().required() }).required(),
  };
}
