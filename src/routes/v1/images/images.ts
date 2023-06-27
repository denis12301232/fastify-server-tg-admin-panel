import type { FastifyInstance } from 'fastify';
import ImagesController from '@/api/controllers/ImageController.js';
import ImageSchemas from '@/api/schemas/ImageSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function ImageRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: { querystring: ImageSchemas.getImagesQuery },
    },
    ImagesController.getImages
  );
  app.post('/upload', { preHandler: [useAuthGuard, useRoleGuard(['admin'])] }, ImagesController.uploadImages);
  app.delete(
    '/delete',
    {
      schema: { body: ImageSchemas.deleteImagesBody },
      preHandler: [useAuthGuard, useRoleGuard(['admin'])],
    },
    ImagesController.deleteImages
  );

  app.patch(
    '/description',
    {
      schema: { body: ImageSchemas.updateDescriptionBody },
      preHandler: [useAuthGuard, useRoleGuard(['admin'])],
    },
    ImagesController.updateDescription
  );
}
