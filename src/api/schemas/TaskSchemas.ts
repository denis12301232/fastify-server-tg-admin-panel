import type { TaskTypes } from '@/types/index.js';
import Joi from 'joi';

export default class TaskSchemas {
  static readonly createTaskBody = Joi.object<TaskTypes.CreateTaskBody>()
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
    .required();

  static readonly updateTaskStatusBody = Joi.object<TaskTypes.UpdateTaskStatusBody>()
    .keys({
      task_id: Joi.string().required(),
      status: Joi.string().required().allow('untaken', 'performed', 'canceled', 'completed'),
    })
    .required();

  static readonly getTaskByIdQuery = Joi.object<TaskTypes.GetTaskByIdQuery>()
    .keys({
      task_id: Joi.string().required(),
    })
    .required();

  static readonly setUserForTaskBody = Joi.object<TaskTypes.SetUserForTaskBody>()
    .keys({
      task_id: Joi.string().required(),
    })
    .required();

  static readonly updateSubtaskBody = Joi.object<TaskTypes.UpdateSubtaskBody>()
    .keys({
      subtask_id: Joi.string().required(),
      status: Joi.string().allow('untaken', 'performed', 'canceled', 'completed'),
      cause: Joi.string(),
    })
    .required();

  static readonly deleteSubtaskQuery = Joi.object<TaskTypes.DeleteSubtaskQuery>()
    .keys({
      subtask_id: Joi.string().required(),
      task_id: Joi.string().required(),
    })
    .required();

  static readonly moveSubtaskBody = Joi.object<TaskTypes.MoveSubtaskBody>()
    .keys({
      subtask_id: Joi.string().required(),
      task_id: Joi.string().required(),
      new_task_id: Joi.string().required(),
    })
    .required();

  static readonly getTasksQuery = Joi.object<TaskTypes.GetTasksQuery>()
    .keys({
      limit: Joi.number().required(),
      page: Joi.number().required().min(1),
      sort: Joi.string().required().allow('createdAt', 'status', 'title'),
      descending: Joi.boolean().required(),
      filter: Joi.string().allow('', 'all', 'my'),
    })
    .required();

  static readonly createTaskCsvQuery = Joi.object<TaskTypes.CreateTaskCsvQuery>()
    .keys({
      task_id: Joi.string().required(),
    })
    .required();
}
