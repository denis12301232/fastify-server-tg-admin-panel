import type { TaskTypes } from '@/types'
import Joi from 'joi'


export class TaskSchemas {
   static readonly createTaskBody = {
      body: Joi.object<TaskTypes.CreateTaskBody>().keys({
         title: Joi.string().required().max(30),
         tags: Joi.array().required().min(1),
         subtasks: Joi.array().items(Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required()
         }))
      }).required()
   }

   static readonly updateTaskStatusBody = {
      body: Joi.object<TaskTypes.UpdateTaskStatusBody>().keys({
         task_id: Joi.string().required(),
         status: Joi.string().required(),
      }).required()
   }

   static readonly getTaskByIdQuery = {
      querystring: Joi.object<TaskTypes.GetTaskByIdQuery>().keys({
         task_id: Joi.string().required()
      }).required()
   }

   static readonly setUserForTaskBody = {
      body: Joi.object<TaskTypes.SetUserForTaskBody>().keys({
         task_id: Joi.string().required()
      }).required()
   }

   static readonly updateSubtaskBody = {
      body: Joi.object<TaskTypes.UpdateSubtaskBody>().keys({
         subtask_id: Joi.string().required(),
         status: Joi.string(),
         cause: Joi.string(),
      }).required()
   }

   static readonly deleteSubtaskQuery = {
      querystring: Joi.object<TaskTypes.DeleteSubtaskQuery>().keys({
         subtask_id: Joi.string().required(),
         task_id: Joi.string().required()
      }).required()
   }

   static readonly moveSubtaskBody = {
      body: Joi.object<TaskTypes.MoveSubtaskBody>().keys({
         subtask_id: Joi.string().required(),
         task_id: Joi.string().required(),
         new_task_id: Joi.string().required()
      }).required()
   }

   static readonly getTasksQuery = {
      querystring: Joi.object<TaskTypes.GetTasksQuery>().keys({
         limit: Joi.number().required(),
         page: Joi.number().required().min(1),
         sort: Joi.string().required().allow('createdAt', 'status', 'title'),
         descending: Joi.boolean().required(),
         filter: Joi.string().allow('', 'all', 'my')
      }).required()
   }

   static readonly createTaskCsvQuery = {
      querystring: Joi.object<TaskTypes.CreateTaskCsvQuery>().keys({
         task_id: Joi.string().required()
      }).required()
   }
} 