import type { FastifyInstance } from 'fastify';
import ChatSchemas from '@/api/schemas/ChatSchemas.js';
import ChatController from '@/api/controllers/ChatController.js';
import { useAuthGuard } from '@/hooks/index.js';

export default async function ChatRoutes(app: FastifyInstance) {
  app.get(
    '/find_users',
    {
      schema: { querystring: ChatSchemas.findUsersQuery },
      preHandler: useAuthGuard,
    },
    ChatController.findUsers
  );
  app.patch(
    '/add_user_to_group',
    {
      schema: { body: ChatSchemas.addUserToGroupBody },
      preHandler: useAuthGuard,
    },
    ChatController.addUserToGroup
  );
  app.patch(
    '/remove_user_from_group',
    {
      schema: { body: ChatSchemas.removeUserFromGroupBody },
      preHandler: useAuthGuard,
    },
    ChatController.removeUserFromGroup
  );
  app.get(
    '/get_users_list_in_chat',
    {
      schema: { querystring: ChatSchemas.getUsersListInChatQuery },
      preHandler: useAuthGuard,
    },
    ChatController.getUsersListInChat
  );
  app.get(
    '/get_user_chats',
    {
      preHandler: useAuthGuard,
    },
    ChatController.getUserChats
  );
  app.get(
    '/open_chat',
    {
      schema: { querystring: ChatSchemas.openChatQuery },
      preHandler: useAuthGuard,
    },
    ChatController.openChat
  );
  app.patch(
    '/delete_chat',
    {
      schema: { body: ChatSchemas.deleteChatBody },
      preHandler: useAuthGuard,
    },
    ChatController.deleteChat
  );
  app.patch(
    '/update_read',
    {
      schema: { body: ChatSchemas.updateReadBody },
      preHandler: useAuthGuard,
    },
    ChatController.updateRead
  );
  app.patch(
    '/update_roles_in_group',
    {
      schema: { body: ChatSchemas.updateRolesInGroupBody },
      preHandler: useAuthGuard,
    },
    ChatController.updateRolesInGroup
  );
  app.patch(
    '/update_group',
    {
      schema: { querystring: ChatSchemas.updateGroupQuery },
      preHandler: useAuthGuard,
    },
    ChatController.updateGroup
  );
  app.get(
    '/get_user_chat_by_id',
    {
      schema: { querystring: ChatSchemas.getUserChatByIdQuery },
      preHandler: useAuthGuard,
    },
    ChatController.getUserChatById
  );
}
