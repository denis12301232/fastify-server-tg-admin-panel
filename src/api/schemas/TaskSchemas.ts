import type { TaskTypes } from '@/types/queries'
import Joi from 'joi'
import Validate from '@/util/Validate'


export class TaskSchemas {
   static readonly createTaskBody = {
      body: Joi.object<TaskTypes.CreateTaskBody>().keys({
         title: Joi.string().required().max(30),
         description: Joi.string().required().max(2048),
         tags: Joi.array().required().min(1),
         date: Joi.string().required()
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
}