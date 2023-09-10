import type { TaskTypes, ISubtask, IUser, ITask } from '@/types/index.js';
import type { FilterQuery } from 'mongoose';
import Models from '@/models/mongo/index.js';
import ApiError from '@/exceptions/ApiError.js';
import Excel from 'exceljs';
import { Readable } from 'stream';

export default class TaskService {
  static async index(userId: string, { page, limit, sort, descending, filter }: TaskTypes.GetTasks['Querystring']) {
    const query: FilterQuery<ITask> = filter === 'my' ? { user: userId } : {};
    const skip = (page - 1) * limit;
    const [tasks, count] = await Promise.all([
      Models.Task.find(query)
        .sort({ [sort]: descending ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Models.Task.count(query),
    ]);

    return { tasks, count };
  }

  static async store(data: TaskTypes.CreateTask['Body']) {
    const { title, tags, subtasks } = data;

    if (!subtasks.length) {
      const task = await Models.Task.create({ title, tags });
      return task;
    }

    const newSubtasks = await Models.Subtask.create(subtasks);
    const subtasksIds = newSubtasks.map((item) => item._id);
    const task = await Models.Task.create({ title, tags, subtasks: subtasksIds });
    return task;
  }

  static async update(taskId: string, { status, userId }: TaskTypes.Update['Body']) {
    const result = await Models.Task.updateOne({ _id: taskId }, { status, user: userId });
    return result;
  }

  static async show(taskId: string) {
    const task = await Models.Task.findById(taskId)
      .populate<ISubtask>({ path: 'subtasks', select: { __v: 0 } })
      .populate<IUser>({ path: 'user', select: { login: 1, email: 1, name: 1 } })
      .lean();
    return task;
  }

  static async createTaskCsv(taskId: string) {
    const task = await Models.Task.findById(taskId, { title: 1 })
      .populate<{ subtasks: ISubtask[] }>({ path: 'subtasks', select: { __v: 0, _id: 0, updatedAt: 0, createdAt: 0 } })
      .lean();
    if (!task?.subtasks) {
      throw ApiError.BadRequest(400, 'No data');
    }
    const header = { title: 'Название', description: 'Описание', status: 'Статус', cause: 'Причина' };
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('Subtasks');
    sheet.columns = Object.entries(header).map(([key, value]) => ({ header: value, key, width: 10 }));
    sheet.addRows(task.subtasks);
    const buffer = await workbook.csv.writeBuffer();

    return Readable.from(Buffer.from(buffer));
  }

  static async updateSubtask(id: string, { status, cause }: TaskTypes.UpdateSubtask['Body']) {
    const updated = await Models.Subtask.updateOne({ _id: id }, { status, cause }).lean();
    return updated;
  }

  static async deleteSubtask(subtaskId: string, { taskId }: TaskTypes.DeleteSubtask['Querystring']) {
    await Models.Task.updateOne({ _id: taskId }, { $pull: { subtasks: { $eq: subtaskId } } }).lean();
    const updated = await Models.Subtask.deleteOne({ _id: taskId }).lean();
    return updated;
  }

  static async moveSubtask(subtaskId: string, { taskId, newTaskId }: TaskTypes.MoveSubtask['Body']) {
    const [result] = await Promise.all([
      Models.Task.updateOne({ _id: newTaskId }, { $addToSet: { subtasks: subtaskId } }).lean(),
      Models.Task.updateOne({ _id: taskId }, { $pull: { subtasks: { $eq: subtaskId } } }).lean(),
    ]);
    return result;
  }
}
