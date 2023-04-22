import type { FastifyInstance } from 'fastify'
import { ImagesController } from '@/api/controllers/ImageController'
import { ImageSchemas } from '@/api/schemas/ImageSchemas'


export default async function ImageRoutes(fastify: FastifyInstance) {
   fastify.get('/', {
      schema: ImageSchemas.getImagesBody
   }, ImagesController.getImages);

   fastify.post('/upload', {}, ImagesController.uploadImages);
   fastify.delete('/delete', {}, ImagesController.deleteImages);
}