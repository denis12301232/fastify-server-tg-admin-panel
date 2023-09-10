import type { FastifyInstance } from 'fastify';
import ChatSchemas from '@/api/schemas/ChatSchemas.js';
import ChatController from '@/api/controllers/ChatController.js';
import { useAuthGuard } from '@/hooks/index.js';

export default async function ChatRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: useAuthGuard }, ChatController.index);
  app.get('/:id', { schema: ChatSchemas.show, preHandler: useAuthGuard }, ChatController.show);
  app.delete('/:id', { schema: ChatSchemas.destroy, preHandler: useAuthGuard }, ChatController.destroy);
  app.get('/:id/messages', { schema: ChatSchemas.chatMessages, preHandler: useAuthGuard }, ChatController.chatMessages);
  app.get('/:id/members', { schema: ChatSchemas.chatMembers, preHandler: useAuthGuard }, ChatController.chatMembers);
  app.patch('/:id/read', { schema: ChatSchemas.updateRead, preHandler: useAuthGuard }, ChatController.updateRead);
  app.patch('/:id/group/members', { schema: ChatSchemas.updateGroupMembers }, ChatController.updateGroupMembers);
  app.patch('/group/:id', { schema: ChatSchemas.updateGroup, preHandler: useAuthGuard }, ChatController.updateGroup);
  app.patch(
    '/group/:id/roles',
    { schema: ChatSchemas.updateGroupRoles, preHandler: useAuthGuard },
    ChatController.updateGroupRoles
  );
  app.get(
    '/attachment',
    { schema: ChatSchemas.chatAttachment, preHandler: useAuthGuard },
    ChatController.chatAttachment
  );
}
