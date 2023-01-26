import type { Types } from 'mongoose'

export interface AnyObject {
   [name: string]: any;
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