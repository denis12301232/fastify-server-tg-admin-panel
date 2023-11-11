import type { FastifyInstance } from 'fastify';
import CommentController from '@/api/controllers/CommentController.js';
import CommentSchemas from '@/api/schemas/CommentSchemas.js';
import { useAuthGuard } from '@/hooks/index.js';

export default async function CommentsRoutes(app: FastifyInstance) {
  app.post('/', { schema: CommentSchemas.store, preHandler: useAuthGuard }, CommentController.store);
  app.get('/', { schema: CommentSchemas.index, preHandler: useAuthGuard }, CommentController.index);
  app.patch('/:id', { preHandler: useAuthGuard }, CommentController.update);
}
