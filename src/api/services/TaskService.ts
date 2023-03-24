import type { TaskTypes, ISubtask, IUser } from '@/types'
import { TaskModel, SubtaskModel } from '@/models/mongo'
import { stringify } from 'csv-stringify'
import { ApiError } from '@/exeptions'
import { Util } from '@/util'


export default class TaskService {
   static async createTask(data: TaskTypes.CreateTaskBody) {
      const { title, tags, subtasks } = data;

      if (!subtasks.length) {
         const task = await TaskModel.create({ title, tags });
         return task;
      }

      const newSubtasks = await SubtaskModel.create(subtasks);
      const subtasksIds = newSubtasks.map(item => item._id);
      const task = await TaskModel.create({ title, tags, subtasks: subtasksIds });
      return task;
   }

   static async getTasks({ page, limit, sort, descending, filter }: TaskTypes.GetTasksQuery, user_id: string) {
      const query = filter === 'my' ? { user: user_id } : {};
      const skip = (page - 1) * limit;
      const tasks = await TaskModel.find(query)
         .sort({ [sort]: descending ? -1 : 1 })
         .lean();

      const count = tasks.length;
      tasks.splice(0, skip);
      tasks.length > limit && (tasks.length = limit);

      return { tasks, count };
   }

   static async updateTaskStatus(task_id: string, status: string) {
      const task = await TaskModel.findByIdAndUpdate(task_id, { status })
         .lean();
      await SubtaskModel.updateMany(
         { _id: { $in: task?.subtasks }, status: { $ne: 'Отменена' } },
         { status })
         .lean();

      return { message: 'Updated' }
   }

   static async getTaskById(task_id: string) {
      const task = await TaskModel.findById(task_id)
         .populate<ISubtask>({ path: 'subtasks', select: { __v: 0 } })
         .populate<IUser>({ path: 'user', select: { login: 1, email: 1, name: 1 } })
         .lean();
      return task;
   }

   static async setUserForTask(user_id: string, task_id: string) {
      const task = await TaskModel.findByIdAndUpdate(task_id, { user: user_id, status: 'В работе' })
         .lean();
      await SubtaskModel.updateMany({ _id: { $in: task?.subtasks } }, { status: 'В работе' })
         .lean();

      return { message: 'Updated' }
   }

   static async updateSubtask(subtask_id: string, status: string, cause: string) {
      const updated = await SubtaskModel.updateOne({ _id: subtask_id }, { status, cause }).lean();
      return updated;
   }

   static async deleteSubtask(subtask_id: string, task_id: string) {
      await TaskModel.updateOne({ _id: task_id }, { $pull: { subtasks: { $eq: subtask_id } } })
         .lean();
      const updated = await SubtaskModel.deleteOne({ _id: task_id })
         .lean();
      return updated;
   }

   static async moveSubtask({ subtask_id, task_id, new_task_id }: TaskTypes.MoveSubtaskBody) {
      await TaskModel.updateOne({ _id: task_id }, { $pull: { subtasks: { $eq: subtask_id } } })
         .lean();
      const result = await TaskModel.updateOne({ _id: new_task_id }, { $addToSet: { subtasks: subtask_id } })
         .lean();
      return result;
   }

   static async createTaskCsv(task_id: string) {
      const task = await TaskModel.findById(task_id, { title: 1, })
         .populate<ISubtask>({ path: 'subtasks', select: { __v: 0, _id: 0, updatedAt: 0 } })
         .lean();
      if (!task?.subtasks) {
         throw ApiError.BadRequest(400, 'No data');
      }
      const file = await Util.pipeStreamAsync(stringify(task.subtasks, {
         header: true, columns: {
            title: 'Название', description: 'Описание', status: 'Статус', cause: 'Причина'
         }
      }), '../../static/temp/', String(task._id) + '.csv');

      return file;
   }
}