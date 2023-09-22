import type { FastifyInstance } from 'fastify';
import AssistanceController from '@/api/controllers/AssistanceController.js';
import AssistanceSchemas from '@/api/schemas/AssistanceSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function AssistanceRoutes(app: FastifyInstance) {
  app.post('/', { schema: AssistanceSchemas.store }, AssistanceController.store);
  app.delete(
    '/',
    { schema: AssistanceSchemas.destroy, onRequest: [useAuthGuard, useRoleGuard(['admin'])] },
    AssistanceController.destroy
  );
  app.post('/catch', { schema: AssistanceSchemas.catch, onRequest: useAuthGuard }, AssistanceController.catch);
  app.patch(
    '/:id',
    { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: AssistanceSchemas.update },
    AssistanceController.update
  );
  app.get(
    '/:id',
    { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: AssistanceSchemas.show },
    AssistanceController.show
  );
  app.post(
    '/sheet',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.saveFormsToGoogleSheets,
    },
    AssistanceController.saveFormsToGoogleSheets
  );
  app.get(
    '/stats',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.getStats,
    },
    AssistanceController.getStats
  );

  app.post('/stats/pdf', {}, AssistanceController.getStatsPdf);

  app.post(
    '/report',
    { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: AssistanceSchemas.createReport },
    AssistanceController.getReport
  );

  app.post(
    '/list',
    {
      onRequest: [useAuthGuard],
    },
    AssistanceController.uploadListCSV
  );
}
