import type { FastifyInstance } from 'fastify';
import MeetController from '@/api/controllers/MeetController.js';
import MeetSchemas from '@/api/schemas/MeetSchemas.js';
import { useAuthGuard } from '@/hooks/index.js';

export default async function MeetRoutes(app: FastifyInstance) {
  app.get(
    '/info',
    {
      preHandler: useAuthGuard,
      schema: { querystring: MeetSchemas.getMeetInfoQuery },
    },
    MeetController.getMeetInfo
  );
}
