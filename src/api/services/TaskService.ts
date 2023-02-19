import { TaskModel } from '@/models/mongo'


export class TaskService {
   static async createTask(title: string, tags: string[], description: string, date: string) {
      const task = await TaskModel.create({ title, tags, description, date, status: 'Не выбрана' });
      return task;
   }

   static async getTasks() {
      const tasks = await TaskModel.find().sort({ updatedAt: -1 }).lean();
      return tasks;
   }

   static async updateTaskStatusBody(task_id: string, status: string) {
      const updated = await TaskModel.updateOne({ _id: task_id }, { status })
         .lean();
      return updated;
   }

   static async getTaskById(task_id: string) {
      const task = await TaskModel.findById(task_id)
         .populate({ path: 'user', select: { login: 1, email: 1, name: 1 } })
         .lean();
      return task;
   }

   static async setUserForTask(user_id: string, task_id: string) {
      const updated = await TaskModel.updateOne({ _id: task_id }, { user: user_id, status: 'В работе' });
      return updated;
   }
}