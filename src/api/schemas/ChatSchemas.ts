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

  static readonly findUsers = {
    querystring: Joi.object<ChatTypes.FindUsers['Querystring']>()
      .keys({
        loginOrName: Joi.string().required(),
      })
      .required(),
  };

  static readonly createChat = {
    body: Joi.object<ChatTypes.CreateChat['Body']>()
      .keys({
        users: Joi.array().required().min(2),
      })
      .required(),
  };

  static readonly addUserToGroup = {
    body: Joi.object<ChatTypes.AddUserToGroup['Body']>()
      .keys({
        user_id: Joi.string().required(),
        chat_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly removeUserFromGroup = {
    body: Joi.object<ChatTypes.RemoveUserFromGroup['Body']>()
      .keys({
        user_id: Joi.string().required(),
        chat_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly getUsersListInChat = {
    querystring: Joi.object<ChatTypes.GetUsersListInChat['Querystring']>()
      .keys({
        chat_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly saveMessage = {
    body: Joi.object<ChatTypes.SaveMessage['Body']>()
      .keys({
        chat_id: Joi.string().required(),
        text: Joi.string().required(),
      })
      .required(),
  };

  static readonly openChat = {
    querystring: Joi.object<ChatTypes.OpenChat['Querystring']>()
      .keys({
        chat_id: Joi.string().required(),
        limit: Joi.number().required().allow('Infinity'),
        page: Joi.number().required(),
      })
      .required(),
  };

  static readonly deleteChat = {
    body: Joi.object<ChatTypes.DeleteChat['Body']>()
      .keys({
        chat_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly updateRead = {
    body: Joi.object<ChatTypes.UpdateRead['Body']>()
      .keys({
        chat_id: Joi.string().required(),
      })
      .required(),
  };

  static readonly saveMediaMessage = {
    querystring: Joi.object<ChatTypes.SaveMediaMessage['Querystring']>()
      .keys({
        chat_id: Joi.string().required(),
        type: Joi.string().required().valid('audio', 'image'),
      })
      .required(),
  };

  static readonly updateRolesInGroup = {
    body: Joi.object<ChatTypes.UpdateRolesInGroup['Body']>()
      .keys({
        group_id: Joi.string().required(),
        role: Joi.string().required().valid('admin'),
        users: Joi.array().required(),
      })
      .required(),
  };

  static readonly updateGroup = {
    querystring: Joi.object<ChatTypes.UpdateGroup['Querystring']>()
      .keys({
        group_id: Joi.string().required(),
        title: Joi.string().allow(''),
        about: Joi.string().allow(''),
      })
      .required(),
  };

  static readonly getUserChatById = {
    querystring: Joi.object<ChatTypes.GetUserChatById['Querystring']>()
      .keys({
        chat_id: Joi.string().required(),
      })
      .required(),
  };
}
