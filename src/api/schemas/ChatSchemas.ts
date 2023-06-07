import type { ChatTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ChatSchemas {
  static readonly typing = Joi.object<ChatTypes.Typing>({
    chatId: Joi.string().required(),
    userName: Joi.string().required(),
    userId: Joi.string().required(),
  }).required();

  static readonly call = Joi.object<ChatTypes.Call>({
    chatId: Joi.string().required(),
  }).required();

  static readonly callAnswer = Joi.object<ChatTypes.CallAnswer>({
    chatId: Joi.string().required(),
    answer: Joi.boolean().required(),
  }).required();

  static readonly callCancel = Joi.object<ChatTypes.CallCancel>({
    chatId: Joi.string().required(),
  }).required();

  static readonly create = Joi.object<ChatTypes.Create>({
    userId: Joi.string().required(),
    users: Joi.array().required().min(1),
  }).required();

  static readonly createGroup = Joi.object<ChatTypes.CreateGroup>({
    title: Joi.string().required(),
    about: Joi.string().allow(''),
    users: Joi.array().required().min(1),
    avatar: Joi.binary().allow(null),
  }).required();

  static readonly message = Joi.object<ChatTypes.Message>({
    text: Joi.string().required().allow(''),
    chatId: Joi.string().required(),
    attachments: Joi.array().items(Joi.binary()).allow(null),
    type: Joi.string().required().valid('image', 'audio').allow(null),
  }).required();

  static readonly findUsersQuery = Joi.object<ChatTypes.FindUsersQuery>()
    .keys({
      loginOrName: Joi.string().required(),
    })
    .required();

  static readonly createChatBody = Joi.object<ChatTypes.CreateChatBody>()
    .keys({
      users: Joi.array().required().min(2),
    })
    .required();

  static readonly createGroupQuery = Joi.object<ChatTypes.CreateGroupQuery>()
    .keys({
      ['users[]']: Joi.array().required().min(1),
      title: Joi.string().required(),
      about: Joi.string(),
    })
    .required();

  static readonly addUserToGroupBody = Joi.object<ChatTypes.AddUserToGroupBody>()
    .keys({
      user_id: Joi.string().required(),
      chat_id: Joi.string().required(),
    })
    .required();

  static readonly removeUserFromGroupBody = Joi.object<ChatTypes.RemoveUserFromGroupBody>()
    .keys({
      user_id: Joi.string().required(),
      chat_id: Joi.string().required(),
    })
    .required();

  static readonly getUsersListInChatQuery = Joi.object<ChatTypes.GetUsersListInChatQuery>()
    .keys({
      chat_id: Joi.string().required(),
    })
    .required();

  static readonly saveMessageBody = Joi.object<ChatTypes.SaveMessageBody>()
    .keys({
      chat_id: Joi.string().required(),
      text: Joi.string().required(),
    })
    .required();

  static readonly openChatQuery = Joi.object<ChatTypes.OpenChatQuery>()
    .keys({
      chat_id: Joi.string().required(),
      limit: Joi.number().required().allow('Infinity'),
      page: Joi.number().required(),
    })
    .required();

  static readonly deleteChatBody = Joi.object<ChatTypes.DeleteChatBody>()
    .keys({
      chat_id: Joi.string().required(),
    })
    .required();

  static readonly updateReadBody = Joi.object<ChatTypes.UpdateReadBody>()
    .keys({
      chat_id: Joi.string().required(),
    })
    .required();

  static readonly saveMediaMessageQuery = Joi.object<ChatTypes.SaveMediaMessageQuery>()
    .keys({
      chat_id: Joi.string().required(),
      type: Joi.string().required().valid('audio', 'image'),
    })
    .required();

  static readonly updateRolesInGroupBody = Joi.object<ChatTypes.UpdateRolesInGroupBody>()
    .keys({
      group_id: Joi.string().required(),
      role: Joi.string().required().valid('admin'),
      users: Joi.array().required(),
    })
    .required();

  static readonly updateGroupQuery = Joi.object<ChatTypes.UpdateGroupQuery>()
    .keys({
      group_id: Joi.string().required(),
      title: Joi.string().allow(''),
      about: Joi.string().allow(''),
    })
    .required();

  static readonly getUserChatByIdQuery = Joi.object<ChatTypes.GetUserChatByIdQuery>()
    .keys({
      chat_id: Joi.string().required(),
    })
    .required();
}
