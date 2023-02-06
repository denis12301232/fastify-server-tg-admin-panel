import type { Types } from 'mongoose'
import Joi, { ObjectSchema } from 'joi'

export interface AnyObject {
   [name: string]: any;
}

export interface WsMessage<T = any> {
   event: WsEvent;
   payload: T;
}

export type WsEvent = 'message' | 'chats_list' | 'open_chat' | 'read' | 'update_status'
   | 'invite_to_group';

export interface IGroup {
   title: string;
   avatar: string;
   roles: Map<string, string>;
}

export interface IMessage {
   chat_id: Types.ObjectId;
   author: Types.ObjectId;
   text: string;
   attachments: [];
   read: string[];
}

export interface IChat {
   users: Types.ObjectId[];
   messages: Types.ObjectId[];
   type: 'dialog' | 'group';
   group?: Types.ObjectId;
   deleted: string[]
   createdAt: NativeDate;
   updatedAt: NativeDate;
}

export interface IUser {
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
   user: Types.ObjectId;
   refreshToken: string;
}

export interface ITools {
   readonly api: {
      readonly google: {
         user: string;
         app_password: string;
         readonly service: {
            user: string;
            privateKey: string;
            sheetId: string;
            folderId: string;
         }
      }
   }
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
   flat: string;
   people_num: number;
   people_fio: string[];
   invalids: string;
   kids: string;
   kids_age: string[];
   food: string;
   water: string;
   medicines: string;
   medicines_info: string;
   hygiene: string;
   hygiene_info: string;
   pampers: string;
   pampers_info: string;
   diet: string;
   pers_data_agreement: boolean;
   photo_agreement: boolean;
}