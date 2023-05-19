import type { FastifyInstance } from 'fastify'
import MeetController from '@/api/controllers/MeetController'
import { MeetSchemas } from '@/api/schemas/MeetSchemas';
import { useAuthGuard } from '@/hooks'

export default async function MeetRoutes(app: FastifyInstance) {
   app.get('/info', {
      preHandler: useAuthGuard,
      schema: { querystring: MeetSchemas.getMeetInfoQuery }
   }, MeetController.getMeetInfo);
}