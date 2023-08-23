import type { RouteGenericInterface } from 'fastify';
import type { Langs, IAssistance } from './index.js';

export namespace ToolsTypes {
  export interface SetNewName extends RouteGenericInterface {
    Body: {
      name: string;
    };
  }

  export interface SetNewEmail extends RouteGenericInterface {
    Body: {
      email: string;
    };
  }

  export interface SetNewPassword extends RouteGenericInterface {
    Body: {
      newPassword: string;
      oldPassword: string;
    };
  }

  export interface SetGoogleServiceAccountSettings extends RouteGenericInterface {
    Body: {
      serviceUser: string;
      servicePrivateKey: string;
      sheetId: string;
      folderId: string;
    };
  }

  export interface UpdateRoles extends RouteGenericInterface {
    Body: {
      _id: string;
      roles: string[];
    };
  }

  export interface GetUsers extends RouteGenericInterface {
    Querystring: {
      limit: number;
      page: number;
      filter: string;
    };
  }
}

export namespace TaskTypes {
  export type TaskStatus = 'untaken' | 'performed' | 'canceled' | 'completed';

  export interface CreateTask extends RouteGenericInterface {
    Body: {
      title: string;
      tags: string[];
      subtasks: [{ title: string; description: string }];
    };
  }

  export interface UpdateTaskStatus extends RouteGenericInterface {
    Body: {
      task_id: string;
      status: TaskStatus;
    };
  }

  export interface GetTaskById extends RouteGenericInterface {
    Querystring: {
      task_id: string;
    };
  }

  export interface SetUserForTask extends RouteGenericInterface {
    Body: {
      task_id: string;
    };
  }

  export interface UpdateSubtask extends RouteGenericInterface {
    Body: {
      subtask_id: string;
      status: TaskStatus;
      cause: string;
    };
  }

  export interface DeleteSubtask extends RouteGenericInterface {
    Querystring: {
      subtask_id: string;
      task_id: string;
    };
  }

  export interface MoveSubtask extends RouteGenericInterface {
    Body: {
      subtask_id: string;
      task_id: string;
      new_task_id: string;
    };
  }

  export interface GetTasks extends RouteGenericInterface {
    Querystring: {
      page: number;
      limit: number;
      sort: string;
      descending: boolean;
      filter: string;
    };
  }

  export interface CreateTaskCsv extends RouteGenericInterface {
    Querystring: {
      task_id: string;
    };
  }
}

export namespace MeetTypes {
  export interface GetInfo extends RouteGenericInterface {
    Querystring: {
      meetId: string;
    };
  }
}

export namespace ImageTypes {
  export interface GetImages extends RouteGenericInterface {
    Querystring: {
      limit: number;
      sort: string;
      descending: boolean;
      skip: number;
    };
  }

  export interface UpdateDescription extends RouteGenericInterface {
    Body: {
      id: string;
      description: string;
    };
  }

  export interface DeleteImages extends RouteGenericInterface {
    Body: string[];
  }
}

export namespace AuthTypes {
  export interface UserRegistration extends RouteGenericInterface {
    Body: {
      login: string;
      name: string;
      email: string;
      password: string;
    };
  }

  export interface UserLogin extends RouteGenericInterface {
    Body: {
      loginOrEmail: string;
      password: string;
    };
  }

  export interface UserActivate extends RouteGenericInterface {
    Params: {
      link: string;
    };
  }

  export interface UserPasswordRestore extends RouteGenericInterface {
    Body: {
      email: string;
    };
  }

  export interface UserNewRestoredPassword extends RouteGenericInterface {
    Body: {
      password: string;
      link: string;
    };
  }
}

export namespace AssistanceTypes {
  export interface SaveForm {
    Body: IAssistance;
  }
  export interface GetForms extends RouteGenericInterface {
    Body: {
      limit: number;
      page: number;
      descending: boolean;
      sort: string;
      filter?: {
        district?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        birth?: { min: number; max: number };
        street?: string;
        sector?: string;
      };
    };
  }
  export interface FindForms extends RouteGenericInterface {
    Querystring: {
      nameOrSurname: string;
      limit: number;
      page: number;
    };
  }

  export interface DeleteForms extends RouteGenericInterface {
    Body: string[];
  }

  export interface ModifyForm extends RouteGenericInterface {
    Body: {
      id: string;
      form: IAssistance;
    };
  }

  export interface GetFormById extends RouteGenericInterface {
    Querystring: {
      id: string;
    };
  }

  export interface SaveFormsToSheets extends RouteGenericInterface {
    Body: {
      locale: Langs;
      ids: string[];
    };
  }

  export interface GetStats extends RouteGenericInterface {
    Querystring: {
      by: 'month' | 'year';
      timestamp: number;
    };
  }

  export interface CreateReport extends RouteGenericInterface {
    Body: {
      locale: Langs;
      type: 'csv' | 'xlsx';
      ids: string[];
    };
  }

  export interface UploadListCSV extends RouteGenericInterface {
    Querystring: {
      locale: Langs;
    };
  }

  export interface FilteredForms extends RouteGenericInterface {
    Body: {
      district?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      birth?: { min: number; max: number };
      street?: string;
      sector?: string;
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
  }

  export interface FindUsers extends RouteGenericInterface {
    Querystring: {
      loginOrName: string;
    };
  }

  export interface CreateChat extends RouteGenericInterface {
    Body: {
      users: string[];
    };
  }

  export interface AddUserToGroup extends RouteGenericInterface {
    Body: {
      user_id: string;
      chatId: string;
    };
  }

  export interface RemoveUserFromGroup extends RouteGenericInterface {
    Body: {
      user_id: string;
      chatId: string;
    };
  }

  export interface GetUsersListInChat extends RouteGenericInterface {
    Querystring: {
      chatId: string;
    };
  }

  export interface SaveMessage extends RouteGenericInterface {
    Body: {
      chatId: string;
      text: string;
    };
  }

  export interface OpenChat extends RouteGenericInterface {
    Querystring: {
      chatId: string;
      limit: number;
      page: number;
    };
  }
  export interface GetChatMessages extends RouteGenericInterface {
    Querystring: {
      chatId: string;
      limit: number;
      skip: number;
    };
  }

  export interface DeleteChat extends RouteGenericInterface {
    Body: {
      chatId: string;
    };
  }

  export interface SaveAudioMessage extends RouteGenericInterface {
    Querystring: {
      chatId: string;
    };
  }

  export interface UpdateRead extends RouteGenericInterface {
    Body: {
      chatId: string;
    };
  }

  export interface SaveMediaMessage extends RouteGenericInterface {
    Querystring: {
      chatId: string;
      type: 'audio' | 'image';
    };
  }

  export interface UpdateRolesInGroup extends RouteGenericInterface {
    Body: {
      group_id: string;
      role: string;
      users: string[];
    };
  }

  export interface UpdateGroup extends RouteGenericInterface {
    Querystring: {
      group_id: string;
      title: string;
      about: string;
    };
  }

  export interface GetUserChatById extends RouteGenericInterface {
    Querystring: {
      chatId: string;
    };
  }

  export interface GetFileFromS3 extends RouteGenericInterface {
    Querystring: {
      filename: string;
    };
  }

  export interface DeleteMessages {
    msgIds: string[];
    chatId: string;
  }

  export interface MessageReaction {
    reaction: string;
    msgId: string;
  }
}
