import type { FastifyInstance } from 'fastify'
import { ImagesController } from '@/api/controllers/ImageController'
import { ImageSchemas } from '@/api/schemas/ImageSchemas'
import { useAuthGuard, useRoleGuard } from '@/hooks'

export default async function ImageRoutes(fastify: FastifyInstance) {
   fastify.get('/', {
      schema: ImageSchemas.getImagesBody
   }, ImagesController.getImages);

   fastify.post('/upload', {
      preHandler: [useAuthGuard, useRoleGuard(['admin'])]
   }, ImagesController.uploadImages);

   fastify.delete('/delete', {
      schema: ImageSchemas.deleteImagesBody,
      preHandler: [useAuthGuard, useRoleGuard(['admin'])]
   }, ImagesController.deleteImages);
}