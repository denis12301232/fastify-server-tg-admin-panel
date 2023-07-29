import type { Types } from 'mongoose';
import type { TaskTypes } from './queries.js';

export interface IAssistance {
  _id: Types.ObjectId;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  birth: string;
  district: string;
  street: string;
  house: string;
  flat: number;
  people_num: number;
  people_fio: string[];
  invalids: boolean;
  kids: boolean;
  kids_age: string[];
  food: boolean;
  water: boolean;
  medicines: boolean;
  medicines_info: string;
  hygiene: boolean;
  hygiene_info: string;
  pampers: boolean;
  pampers_info: string;
  diet: string;
  pers_data_agreement: boolean;
  photo_agreement: boolean;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  sector: string;
}

export interface IAttachment {
  _id: Types.ObjectId;
  name: string;
  ext: string;
  mime: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface IChat {
  _id: Types.ObjectId;
  users: Types.ObjectId[];
  messages: Types.ObjectId[];
  type: 'dialog' | 'group';
  group?: Types.ObjectId;
  deleted: string[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface IGroup {
  _id: Types.ObjectId;
  title: string;
  avatar: string;
  about: string;
  roles: { [name: string]: string[] };
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface IMessage {
  _id: Types.ObjectId;
  chat_id: Types.ObjectId;
  author: Types.ObjectId;
  text: string;
  attachments: [];
  read: string[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface ISubtask {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: string;
  cause: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface ITask {
  _id: Types.ObjectId;
  title: string;
  tags: string[];
  status: TaskTypes.TaskStatus;
  subtasks: Types.ObjectId[];
  user: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface IToken {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  refreshToken: string;
}

export interface ITools {
  _id: Types.ObjectId;
  api: string;
  settings: { [name: string]: unknown };
}

export interface IUser {
  _id: Types.ObjectId;
  login: string;
  email: string;
  password: string;
  name: string;
  isActivated: boolean;
  activationLink: string;
  roles: string[];
  avatar: string;
  status: 'online' | 'offline';
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface IMedia {
  _id: Types.ObjectId;
  description?: string;
  fileName: string;
  mimeType: string;
  ext: string;
}
