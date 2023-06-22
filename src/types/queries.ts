import type { Langs, IAssistance } from './index.js';

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

  export interface GetLocaleQuery {
    locale: Langs;
  }
}

export namespace TaskTypes {
  export type TaskStatus = 'untaken' | 'performed' | 'canceled' | 'completed';

  export interface CreateTaskBody {
    title: string;
    tags: string[];
    subtasks: [{ title: string; description: string }];
  }

  export interface UpdateTaskStatusBody {
    task_id: string;
    status: TaskStatus;
  }

  export interface GetTaskByIdQuery {
    task_id: string;
  }

  export interface SetUserForTaskBody {
    task_id: string;
  }

  export interface UpdateSubtaskBody {
    subtask_id: string;
    status: TaskStatus;
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

export namespace MeetTypes {
  export interface GetInfoQuery {
    meetId: string;
  }
}

export namespace ImageTypes {
  export interface GetImagesQuery {
    pageToken: string;
  }

  export type DeleteImagesBody = string[];
}

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

  export type DeleteFormsBody = string[];

  export interface ModifyFormBody {
    id: string;
    form: IAssistance;
  }

  export interface GetFormByIdQuery {
    id: string;
  }

  export interface SaveFormsToSheetsBody {
    locale: Langs;
    filters: {
      district?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      birth: { from: string; to: string };
      street?: string;
    };
  }

  export interface GetStatsQuery {
    by: 'month' | 'year';
    timestamp: number;
  }

  export interface CreateReportBody {
    locale: Langs;
    type: 'csv' | 'xlsx';
    filters: {
      district?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      birth: { from: string; to: string };
      street?: string;
    };
  }
}

export namespace ChatTypes {
  export interface Typing {
    chatId: string;
    userName: string;
    userId: string;
  }

  export interface Call {
    chatId: string;
  }

  export interface CallAnswer {
    chatId: string;
    answer: boolean;
  }

  export interface CallCancel {
    chatId: string;
  }

  export interface Create {
    userId: string;
    users: string[];
  }

  export interface CreateGroup {
    users: string[];
    title: string;
    about: string;
    avatar: Buffer;
  }

  export interface Message {
    chatId: string;
    text: string;
    attachments?: Buffer[];
    type: 'audio' | 'image';
  }

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
