import type { AssistanceForm } from '@/types'


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
   export interface SaveFormBody extends AssistanceForm { }

   export interface GetFormsQuery {
      nameOrSurname: string;
      limit: number;
      page: number;
   }

   export interface GetHumansListQuery {
      limit: number;
      page: number;
      filter: string;
      sort: string;
      descending: boolean;
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
      birth: {
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
      filter: string;
   }
}

export namespace MessangerTypes {
   export interface FindUsersQuery {
      loginOrName: string;
   }

   export interface CreateChatBody {
      users: string[];
   }

   export interface CreateGroupQuery {
      'users[]': string[];
      title: string;
      about: string;
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

   export interface SaveMessageBody {
      chat_id: string;
      text: string;
   }

   export interface OpenChatQuery {
      chat_id: string;
      limit: number;
      page: number;
   }

   export interface DeleteChatBody {
      chat_id: string;
   }

   export interface SaveAudioMessageQuery {
      chat_id: string;
   }

   export interface UpdateReadBody {
      chat_id: string;
   }

   export interface SaveMediaMessageQuery {
      chat_id: string;
      type: 'audio' | 'image';
   }

   export interface UpdateRolesInGroupBody {
      group_id: string;
      role: string;
      users: string[];
   }

   export interface UpdateGroupQuery {
      group_id: string;
      title: string;
      about: string;
   }

   export interface GetUserChatByIdQuery {
      chat_id: string;
   }
}

export namespace TaskTypes {
   export interface CreateTaskBody {
      title: string;
      tags: string[];
      subtasks: [{ title: string, description: string }]
   }

   export interface UpdateTaskStatusBody {
      task_id: string;
      status: 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена';
   }

   export interface GetTaskByIdQuery {
      task_id: string;
   }

   export interface SetUserForTaskBody {
      task_id: string;
   }

   export interface UpdateSubtaskBody {
      subtask_id: string;
      status: 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена';
      cause: string;
   }

   export interface DeleteSubtaskQuery {
      subtask_id: string;
      task_id: string;
   }

   export interface MoveSubtaskBody {
      subtask_id: string;
      task_id: string;
      new_task_id: string;
   }

   export interface GetTasksQuery {
      page: number;
      limit: number;
      sort: string;
      descending: boolean;
      filter: string;
   }

   export interface CreateTaskCsvQuery {
      task_id: string;
   }
}