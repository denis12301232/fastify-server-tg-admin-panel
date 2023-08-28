import type { FastifyInstance } from 'fastify';
import AssistanceController from '@/api/controllers/AssistanceController.js';
import AssistanceSchemas from '@/api/schemas/AssistanceSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function AssistanceRoutes(app: FastifyInstance) {
  app.post('/', { schema: AssistanceSchemas.saveForm }, AssistanceController.store);
  app.post('/forms', { schema: AssistanceSchemas.getForms }, AssistanceController.getForms);
  app.get(
    '/search',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.findForms,
    },
    AssistanceController.search
  );
  app.delete(
    '/',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.deleteForms,
    },
    AssistanceController.destroy
  );
  app.patch(
    '/',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.modifyForm,
    },
    AssistanceController.update
  );
  app.get(
    '/:id',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.getFormById,
    },
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

  app.post('/stats/pdf', {}, AssistanceController.getStatsPdf)

  app.post(
    '/report',
    { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: AssistanceSchemas.createReport },
    AssistanceController.getReport
  );

  app.post(
    '/list',
    {
      onRequest: [useAuthGuard]
    },
    AssistanceController.uploadListCSV
  );
}
