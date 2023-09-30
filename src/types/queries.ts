import type { RouteGenericInterface } from 'fastify';
import type { IAssistance } from './index.js';

export namespace NoticeTypes {
  export interface Store extends RouteGenericInterface {
    Body: {
      title: string;
      text: string;
      show?: boolean;
    };
  }

  export interface Destroy extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface Update extends RouteGenericInterface {
    Params: {
      id: string;
    };
    Body: {
      show: boolean;
    };
  }
}

export namespace ToolsTypes {
  export interface SetGoogleServiceAccountSettings extends RouteGenericInterface {
    Body: {
      serviceUser: string;
      servicePrivateKey: string;
      sheetId: string;
      folderId: string;
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

  export interface Update extends RouteGenericInterface {
    Body: {
      userId: string;
      status: TaskStatus;
    };
    Params: {
      id: string;
    };
  }

  export interface UpdateTaskStatus extends RouteGenericInterface {
    Body: {
      taskId: string;
      status: TaskStatus;
    };
  }

  export interface GetTaskById extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface SetUserForTask extends RouteGenericInterface {
    Body: {
      taskId: string;
    };
  }

  export interface UpdateSubtask extends RouteGenericInterface {
    Body: {
      status: TaskStatus;
      cause: string;
    };
    Params: {
      id: string;
    };
  }

  export interface DeleteSubtask extends RouteGenericInterface {
    Querystring: {
      taskId: string;
    };
    Params: {
      id: string;
    };
  }

  export interface MoveSubtask extends RouteGenericInterface {
    Body: {
      taskId: string;
      newTaskId: string;
    };
    Params: {
      id: string;
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

  export interface Report extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }
}

export namespace MeetTypes {
  export interface Create extends RouteGenericInterface {
    Body: {
      title: string;
      invited: string[];
    };
  }

  export interface Show extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface Update extends RouteGenericInterface {
    Params: {
      id: string;
    };
    Body: {
      invited: string[];
      title: string;
    };
  }

  export interface Join extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface Leave extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface Invite extends RouteGenericInterface {
    Params: {
      id: string;
    };
    Body: string[];
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
      description: string;
    };
    Params: {
      id: string;
    };
  }

  export interface DeleteImages extends RouteGenericInterface {
    Body: string[];
  }
}

export namespace AuthTypes {
  export interface Registration extends RouteGenericInterface {
    Body: {
      login: string;
      name: string;
      email: string;
      password: string;
    };
  }

  export interface Login extends RouteGenericInterface {
    Body: {
      loginOrEmail: string;
      password: string;
    };
  }

  export interface Activate extends RouteGenericInterface {
    Params: {
      link: string;
    };
  }

  export interface RestorePassword extends RouteGenericInterface {
    Body: {
      email: string;
    };
  }

  export interface SetNewPassword extends RouteGenericInterface {
    Body: {
      password: string;
      link: string;
    };
  }
}

export namespace AssistanceTypes {
  export interface Store extends RouteGenericInterface {
    Body: IAssistance;
  }

  export interface Destroy extends RouteGenericInterface {
    Body: string[];
  }

  export interface Catch extends RouteGenericInterface {
    Body: {
      limit: number;
      page: number;
      descending: boolean;
      sort: string;
      filter?: {
        district?: number;
        birth?: { min: number; max: number };
        street?: string;
        sector?: string;
        nameOrSurname?: string;
      };
    };
  }

  export interface Update extends RouteGenericInterface {
    Params: {
      id: string;
    };
    Body: IAssistance;
  }

  export interface Show extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface SaveFormsToSheets extends RouteGenericInterface {
    Body: {
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
      type: 'csv' | 'xlsx';
      ids: string[];
    };
  }

  export interface FilteredForms extends RouteGenericInterface {
    Body: {
      district?: number;
      birth?: { min: number; max: number };
      street?: string;
      sector?: string;
    };
  }
}

export namespace ChatTypes {
  export interface Show extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface Destroy extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface GetMessages extends RouteGenericInterface {
    Querystring: {
      limit: number;
      skip: number;
    };
    Params: {
      id: string;
    };
  }

  export interface GetMembers extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

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

  export interface CreateChat extends RouteGenericInterface {
    Body: {
      users: string[];
    };
  }

  export interface UpdateGroupMembers extends RouteGenericInterface {
    Params: {
      id: string;
    };
    Body: {
      userId: string;
      action: 'add' | 'kick';
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

  export interface SaveAudioMessage extends RouteGenericInterface {
    Querystring: {
      chatId: string;
    };
  }

  export interface UpdateRead extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface SaveMediaMessage extends RouteGenericInterface {
    Querystring: {
      chatId: string;
      type: 'audio' | 'image';
    };
  }

  export interface UpdateGroupRoles extends RouteGenericInterface {
    Params: {
      id: string;
    };
    Body: {
      role: string;
      users: string[];
    };
  }

  export interface UpdateGroup extends RouteGenericInterface {
    Params: {
      id: string;
    };
    Querystring: {
      title: string;
      about: string;
    };
  }

  export interface GetAttachment extends RouteGenericInterface {
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

export namespace UserTypes {
  export interface GetUser extends RouteGenericInterface {
    Params: {
      id: string;
    };
  }

  export interface GetUsers extends RouteGenericInterface {
    Querystring: {
      limit: number;
      page: number;
      filter: string;
    };
  }

  export interface UpdateEmail extends RouteGenericInterface {
    Body: {
      email: string;
    };
  }

  export interface UpdateName extends RouteGenericInterface {
    Body: {
      name: string;
    };
  }

  export interface UpdatePassword extends RouteGenericInterface {
    Body: {
      newPassword: string;
      oldPassword: string;
    };
  }

  export interface UpdateRoles extends RouteGenericInterface {
    Body: {
      _id: string;
      roles: string[];
    };
  }
}
