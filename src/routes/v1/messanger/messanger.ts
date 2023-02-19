import type { FastifyInstance } from 'fastify'
import { MessangerSchemas } from '@/api/schemas/MessangerSchemas'
import { MessangerController } from '@/api/controllers/MessangerController'
import { useSocketGuard, useAuthGuard } from '@/hooks'


export default async function MessangerRoutes(fastify: FastifyInstance) {
   fastify.get('/', {
      websocket: true,
      preHandler: useSocketGuard
   }, MessangerController.websocketConnect);

   fastify.get('/find_users', {
      schema: MessangerSchemas.findUsersQuery,
      preHandler: useAuthGuard
   }, MessangerController.findUsers);

   fastify.post('/create_chat', {
      schema: MessangerSchemas.createChatBody,
      preHandler: useAuthGuard
   }, MessangerController.createChat);

   fastify.post('/create_group', {
      schema: MessangerSchemas.createGroupBody,
      preHandler: useAuthGuard,
   }, MessangerController.createGroup);

   fastify.patch('/add_user_to_group', {
      schema: MessangerSchemas.addUserToGroupBody,
      preHandler: useAuthGuard,
   }, MessangerController.addUserToGroup);

   fastify.patch('/remove_user_from_group', {
      schema: MessangerSchemas.removeUserFromGroupBody,
      preHandler: useAuthGuard
   }, MessangerController.removeUserFromGroup);

   fastify.get('/get_users_list_in_chat', {
      schema: MessangerSchemas.getUsersListInChatQuery,
      preHandler: useAuthGuard,
   }, MessangerController.getUsersListInChat);

   fastify.post('/save_message', {
      schema: MessangerSchemas.saveMessageBody,
      preHandler: useAuthGuard,
   }, MessangerController.saveMessage);

   fastify.get('/get_user_chats', {
      preHandler: useAuthGuard,
   }, MessangerController.getUserChats);

   fastify.get('/open_chat', {
      schema: MessangerSchemas.openChatQuery,
      preHandler: useAuthGuard,
   }, MessangerController.openChat);

   fastify.patch('/delete_chat', {
      schema: MessangerSchemas.deleteChatBody,
      preHandler: useAuthGuard
   }, MessangerController.deleteChat);

   fastify.patch('/update_read', {
      schema: MessangerSchemas.updateReadBody,
      preHandler: useAuthGuard,
   }, MessangerController.updateRead);

   fastify.post('/save_media_message', {
      schema: MessangerSchemas.saveMediaMessageQuery,
      preHandler: useAuthGuard
   }, MessangerController.saveMediaMessage);

   fastify.patch('/update_roles_in_group', {
      schema: MessangerSchemas.updateRolesInGroupBody,
      preHandler: useAuthGuard
   }, MessangerController.updateRolesInGroup);
}