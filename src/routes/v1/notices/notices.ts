import type { FastifyInstance } from 'fastify';
import NoticeController from '@/api/controllers/NoticeController.js';
import NoticeSchemas from '@/api/schemas/NoticeSchemas.js';
import { useAuthGuard } from '@/hooks/index.js';

export default async function NoticesRoutes(app: FastifyInstance) {
  app.get('/', { onRequest: useAuthGuard }, NoticeController.index);
  app.post('/', { schema: NoticeSchemas.store, onRequest: useAuthGuard }, NoticeController.store);
  app.patch('/:id', { schema: NoticeSchemas.update, onRequest: useAuthGuard }, NoticeController.update);
  app.delete('/:id', { schema: NoticeSchemas.destroy, onRequest: useAuthGuard }, NoticeController.destroy);
  app.delete('/', { onRequest: useAuthGuard }, NoticeController.clear);
}
