import type { FastifyInstance } from 'fastify';
import ImagesController from '@/api/controllers/ImageController.js';
import ImageSchemas from '@/api/schemas/ImageSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function ImageRoutes(app: FastifyInstance) {
  app.get('/', { schema: ImageSchemas.index }, ImagesController.index);
  app.post('/', { preHandler: [useAuthGuard, useRoleGuard(['admin'])] }, ImagesController.store);
  app.delete(
    '/',
    { schema: ImageSchemas.delete, preHandler: [useAuthGuard, useRoleGuard(['admin'])] },
    ImagesController.destroy
  );
  app.patch(
    '/:id',
    { schema: ImageSchemas.update, preHandler: [useAuthGuard, useRoleGuard(['admin'])] },
    ImagesController.update
  );
}
