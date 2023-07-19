import type { FastifyInstance } from 'fastify';
import ImagesController from '@/api/controllers/ImageController.js';
import ImageSchemas from '@/api/schemas/ImageSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function ImageRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: ImageSchemas.getImages,
    },
    ImagesController.getImages
  );
  app.post('/upload', { preHandler: [useAuthGuard, useRoleGuard(['admin'])] }, ImagesController.uploadImages);
  app.delete(
    '/delete',
    {
      schema: ImageSchemas.deleteImages,
      preHandler: [useAuthGuard, useRoleGuard(['admin'])],
    },
    ImagesController.deleteImages
  );

  app.patch(
    '/description',
    {
      schema: ImageSchemas.updateDescription,
      preHandler: [useAuthGuard, useRoleGuard(['admin'])],
    },
    ImagesController.updateDescription
  );
}
