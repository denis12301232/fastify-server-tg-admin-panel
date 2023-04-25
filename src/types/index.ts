import type { Types } from 'mongoose'

export * from './queries'
export * from './io'
export * from './socket'

export interface AnyObject {
   [name: string]: any;
}

export type TaskStatus = 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена';

export interface ITask {
   _id: Types.ObjectId;
   title: string;
   tags: string[];
   status: TaskStatus;
   subtasks: Types.ObjectId[];
   user: Types.ObjectId;
}

export interface ISubtask {
   _id: Types.ObjectId;
   title: string;
   description: string;
   status: string;
   cause: string;
}
export interface IGroup {
   title: string;
   avatar: string;
   about: string;
   roles: { [name: string]: string[] };
}

export interface IMessage {
   _id: Types.ObjectId;
   chat_id: Types.ObjectId;
   author: Types.ObjectId;
   text: string;
   attachments: [];
   read: string[];
}

export interface IChat {
   _id: Types.ObjectId;
   users: Types.ObjectId[];
   messages: Types.ObjectId[];
   type: 'dialog' | 'group';
   group?: Types.ObjectId;
   deleted: string[]
   createdAt: NativeDate;
   updatedAt: NativeDate;
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
}

export interface IToken {
   _id: Types.ObjectId;
   user: Types.ObjectId;
   refreshToken: string;
}

export interface ITools {
   _id: Types.ObjectId;
   api: string;
   settings: { [name: string]: any }
}

export interface AssistanceForm {
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
}