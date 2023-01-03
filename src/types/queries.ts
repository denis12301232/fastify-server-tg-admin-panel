import type { AssistanceForm } from './interfaces'


export namespace AuthTypes {
   export interface UserRegistrationBody {
      name: string;
      email: string;
      password: string;
   }

   export interface UserLoginBody {
      email: string;
      password: string;
   }

   export interface UserActivateParams {
      link: string;
   }

   export interface UserPasswordRestoreBody {
      email: string;
   }

   export interface UserNewRestoredPasswordBody {
      password: string;
      link: string;
   }
}

export namespace AssistanceTypes {
   export interface SaveFormBody {
      form: AssistanceForm;
   }

   export interface GetFormsQuery {
      name: string;
      surname: string;
      patronymic: string;
   }

   export interface GetHumansListQuery {
      limit: number;
      page: number;
   }

   export interface DeleteFormByIdBody {
      id: string;
   }

   export interface ModifyFormBody {
      id: string;
      form: AssistanceForm;
   }

   export interface GetFormByIdQuery {
      id: string;
   }

   export interface SaveFormsToSheetsBody {
      district?: 'Индустриальный' | 'Киевский' | 'Московский' | 'Немышлянский'
      | 'Новобаварский' | 'Основянский' | 'Слободской' | 'Холодногорский' | 'Шевченковский';
      birth?: {
         from: string;
         to: string;
      }
   }
}

export namespace ImageTypes {
   export interface GetImagesQuery {
      pageToken: string;
   }
}

export namespace ToolsTypes {
   export interface SetNewNameBody {
      name: string;
   }

   export interface SetNewEmailBody {
      email: string;
   }

   export interface SetNewPasswordBody {
      newPassword: string;
      oldPassword: string;
   }

   export interface SetGoogleServiceAccountSettingsBody {
      serviceUser: string;
      servicePrivateKey: string;
      sheetId: string;
      folderId: string;
   }

   export interface UpdateRolesBody {
      _id: string;
      roles: string[];
   }
}