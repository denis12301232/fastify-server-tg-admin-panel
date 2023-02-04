import type { AssistanceForm } from './interfaces'


export namespace AuthTypes {
   export interface UserRegistrationBody {
      login: string;
      name: string;
      email: string;
      password: string;
   }

   export interface UserLoginBody {
      loginOrEmail: string;
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
      nameOrSurname: string;
      limit: number;
      page: number;
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

   export interface GetUsersQuery {
      limit: number;
      page: number;
   }
}

export namespace MessangerTypes {
   export interface FindUsersQuery {
      loginOrName: string;
   }

   export interface CreateChatBody {
      users: string[];
   }

   export interface CreateGroupBody {
      users: string[];
      title: string;
   }

   export interface AddUserToGroupBody {
      user_id: string;
      chat_id: string;
   }

   export interface RemoveUserFromGroupBody {
      user_id: string;
      chat_id: string;
   }

   export interface GetUsersListInChatQuery {
      chat_id: string;
   }

   export interface LeaveGroupQuery {
      chat_id: string;
   }

   export interface SaveMessageBody {
      chat_id: string;
      text: string;
   }

   export interface OpenChatQuery {
      chat_id: string;
      skip: number;
   }

   export interface DeleteChatBody {
      chat_id: string;
   }

   export interface SaveAudioMessageQuery {
      chat_id: string;
   }
}