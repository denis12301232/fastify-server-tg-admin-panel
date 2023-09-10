import type { ChatTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ChatSchemas {
  static readonly show = {
    params: Joi.object<ChatTypes.Show['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly destroy = {
    params: Joi.object<ChatTypes.Destroy['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly chatMessages = {
    querystring: Joi.object<ChatTypes.GetMessages['Querystring']>()
      .keys({ limit: Joi.number().required(), skip: Joi.number().required() })
      .required(),
    params: Joi.object<ChatTypes.GetMessages['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly chatMembers = {
    params: Joi.object<ChatTypes.GetMembers['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly chatAttachment = {
    querystring: Joi.object<ChatTypes.GetAttachment['Querystring']>()
      .keys({ filename: Joi.string().required() })
      .required(),
  };

  static readonly updateRead = {
    params: Joi.object<ChatTypes.UpdateRead['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly updateGroup = {
    params: Joi.object<ChatTypes.UpdateGroup['Params']>().keys({ id: Joi.string().required() }).required(),
    querystring: Joi.object<ChatTypes.UpdateGroup['Querystring']>()
      .keys({ title: Joi.string().allow(''), about: Joi.string().allow('') })
      .required(),
  };

  static readonly updateGroupMembers = {
    params: Joi.object<ChatTypes.UpdateGroupMembers['Params']>().keys({ id: Joi.string().required() }).required(),
    body: Joi.object<ChatTypes.UpdateGroupMembers['Body']>()
      .keys({
        action: Joi.string().valid('add', 'kick').required(),
        userId: Joi.string().required(),
      })
      .required(),
  };

  static readonly updateGroupRoles = {
    params: Joi.object<ChatTypes.UpdateGroupRoles['Params']>().keys({ id: Joi.string().required() }).required(),
    body: Joi.object<ChatTypes.UpdateGroupRoles['Body']>()
      .keys({
        role: Joi.string().required().valid('admin'),
        users: Joi.array().required(),
      })
      .required(),
  };

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
  }).required();

  static readonly createChat = {
    body: Joi.object<ChatTypes.CreateChat['Body']>()
      .keys({
        users: Joi.array().required().min(2),
      })
      .required(),
  };

  static readonly saveMessage = {
    body: Joi.object<ChatTypes.SaveMessage['Body']>()
      .keys({
        chatId: Joi.string().required(),
        text: Joi.string().required(),
      })
      .required(),
  };

  static readonly saveMediaMessage = {
    querystring: Joi.object<ChatTypes.SaveMediaMessage['Querystring']>()
      .keys({
        chatId: Joi.string().required(),
        type: Joi.string().required().valid('audio', 'image'),
      })
      .required(),
  };

  static readonly deleteMessages = Joi.object<ChatTypes.DeleteMessages>()
    .keys({
      chatId: Joi.string().required(),
      msgIds: Joi.array().items(Joi.string()).required(),
    })
    .required();
}
