import type { FastifyInstance } from 'fastify';
import MeetController from '@/api/controllers/MeetController.js';
import MeetSchemas from '@/api/schemas/MeetSchemas.js';
import { useAuthGuard } from '@/hooks/index.js';

export default async function MeetRoutes(app: FastifyInstance) {
  app.get('/:id', { schema: MeetSchemas.show, preHandler: useAuthGuard }, MeetController.show);
  app.post('/create', { schema: MeetSchemas.create, preHandler: useAuthGuard }, MeetController.create);
  app.patch('/:id', { schema: MeetSchemas.update, preHandler: useAuthGuard }, MeetController.update);
  app.get('/:id/join', { schema: MeetSchemas.join, preHandler: useAuthGuard }, MeetController.join);
  app.get('/:id/leave', { schema: MeetSchemas.leave, preHandler: useAuthGuard }, MeetController.leave);
  app.post('/:id/invite', { schema: MeetSchemas.invite, preHandler: useAuthGuard }, MeetController.invite);
}
