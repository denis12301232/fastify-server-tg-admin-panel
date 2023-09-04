import type { FastifyInstance } from 'fastify';
import ToolsController from '@/api/controllers/ToolsController.js';
import ToolsSchemas from '@/api/schemas/ToolsSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function ToolsRoutes(app: FastifyInstance) {
  app.post(
    '/google/service',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: ToolsSchemas.setGoogleServiceAccountSettings,
    },
    ToolsController.setGoogleServiceAccountSettings
  );

}
