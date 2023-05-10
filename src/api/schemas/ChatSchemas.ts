import type { ChatTypes } from '@/types'
import Joi from 'joi'


export default class ChatSchemas {
   static readonly typing = Joi.object<ChatTypes.Typing>({
      chatId: Joi.string().required(),
      userName: Joi.string().required(),
      userId: Joi.string().required(),
   }).required();

   static readonly call = Joi.object<ChatTypes.Call>({
      chatId: Joi.string().required()
   }).required();

   static readonly callAnswer = Joi.object<ChatTypes.CallAnswer>({
      chatId: Joi.string().required(),
      answer: Joi.boolean().required(),
   }).required();

   static readonly callCancel = Joi.object<ChatTypes.CallCancel>({
      chatId: Joi.string().required()
   }).required();

   static readonly create = Joi.object<ChatTypes.Create>({
      userId: Joi.string().required(),
      users: Joi.array().required().min(1)
   }).required();

   static readonly createGroup = Joi.object<ChatTypes.CreateGroup>({
      title: Joi.string().required(),
      about: Joi.string().allow(''),
      users: Joi.array().required().min(1),
      avatar: Joi.binary().allow(null)
   }).required();

   static readonly message = Joi.object<ChatTypes.Message>({
      text: Joi.string().required().allow(null),
      chatId: Joi.string().required(),
      attachments: Joi.array().items(Joi.binary()).allow(null),
      type: Joi.string().required().valid('image', 'audio').allow(null)
   }).required();
}