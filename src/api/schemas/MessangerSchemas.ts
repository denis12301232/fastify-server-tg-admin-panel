import type { MessangerTypes } from '@/types/queries'
import Joi from 'joi'


export class MessangerSchemas {
   static readonly findUsersQuery = {
      querystring: Joi.object<MessangerTypes.FindUsersQuery>().keys({
         loginOrName: Joi.string().required()
      }).required()
   }

   static readonly createChatBody = {
      body: Joi.object<MessangerTypes.CreateChatBody>().keys({
         users: Joi.array().required().min(2)
      }).required()
   }

   static readonly createGroupBody = {
      body: Joi.object<MessangerTypes.CreateGroupBody>().keys({
         users: Joi.array().required().min(1),
         title: Joi.string().required()
      }).required()
   }

   static readonly addUserToGroupBody = {
      body: Joi.object<MessangerTypes.AddUserToGroupBody>().keys({
         user_id: Joi.string().required(),
         chat_id: Joi.string().required(),
      }).required()
   }

   static readonly removeUserFromGroupBody = {
      body: Joi.object<MessangerTypes.RemoveUserFromGroupBody>().keys({
         user_id: Joi.string().required(),
         chat_id: Joi.string().required(),
      }).required()
   }

   static readonly getUsersListInChatQuery = {
      querystring: Joi.object<MessangerTypes.GetUsersListInChatQuery>().keys({
         chat_id: Joi.string().required(),
      }).required()
   }

   static readonly leaveGroupQuery = {
      querystring: Joi.object<MessangerTypes.LeaveGroupQuery>().keys({
         chat_id: Joi.string().required(),
      }).required()
   }

   static readonly saveMessageBody = {
      body: Joi.object<MessangerTypes.SaveMessageBody>().keys({
         chat_id: Joi.string().required(),
         text: Joi.string().required(),
      }).required()
   }

   static readonly openChatQuery = {
      querystring: Joi.object<MessangerTypes.OpenChatQuery>().keys({
         chat_id: Joi.string().required(),
         skip: Joi.number().required(),
      }).required()
   }

   static readonly deleteChatBody = {
      body: Joi.object<MessangerTypes.DeleteChatBody>().keys({
         chat_id: Joi.string().required(),
      }).required()
   }

   static readonly saveAudioMessageQuery = {
      querystring: Joi.object<MessangerTypes.SaveAudioMessageQuery>().keys({
         chat_id: Joi.string().required(),
      }).required()
   }
}