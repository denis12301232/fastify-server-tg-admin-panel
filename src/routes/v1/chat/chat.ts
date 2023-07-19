import type { FastifyInstance } from 'fastify';
import ChatSchemas from '@/api/schemas/ChatSchemas.js';
import ChatController from '@/api/controllers/ChatController.js';
import { useAuthGuard } from '@/hooks/index.js';

export default async function ChatRoutes(app: FastifyInstance) {
  app.get(
    '/find_users',
    {
      schema: ChatSchemas.findUsers,
      preHandler: useAuthGuard,
    },
    ChatController.findUsers
  );
  app.patch(
    '/add_user_to_group',
    {
      schema: ChatSchemas.addUserToGroup,
      preHandler: useAuthGuard,
    },
    ChatController.addUserToGroup
  );
  app.patch(
    '/remove_user_from_group',
    {
      schema: ChatSchemas.removeUserFromGroup,
      preHandler: useAuthGuard,
    },
    ChatController.removeUserFromGroup
  );
  app.get(
    '/get_users_list_in_chat',
    {
      schema: ChatSchemas.getUsersListInChat,
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
      schema: ChatSchemas.openChat,
      preHandler: useAuthGuard,
    },
    ChatController.openChat
  );
  app.patch(
    '/delete_chat',
    {
      schema: ChatSchemas.deleteChat,
      preHandler: useAuthGuard,
    },
    ChatController.deleteChat
  );
  app.patch(
    '/update_read',
    {
      schema: ChatSchemas.updateRead,
      preHandler: useAuthGuard,
    },
    ChatController.updateRead
  );
  app.patch(
    '/update_roles_in_group',
    {
      schema: ChatSchemas.updateRolesInGroup,
      preHandler: useAuthGuard,
    },
    ChatController.updateRolesInGroup
  );
  app.patch(
    '/update_group',
    {
      schema: ChatSchemas.updateGroup,
      preHandler: useAuthGuard,
    },
    ChatController.updateGroup
  );
  app.get(
    '/get_user_chat_by_id',
    {
      schema: ChatSchemas.getUserChatById,
      preHandler: useAuthGuard,
    },
    ChatController.getUserChatById
  );
}
