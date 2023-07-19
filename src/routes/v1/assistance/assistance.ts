import type { FastifyInstance } from 'fastify';
import AssistanceController from '@/api/controllers/AssistanceController.js';
import AssistanceSchemas from '@/api/schemas/AssistanceSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function AssistanceRoutes(app: FastifyInstance) {
  app.post('/', { schema: AssistanceSchemas.saveForm }, AssistanceController.saveForm);
  app.get('/forms', { schema: AssistanceSchemas.getForms }, AssistanceController.getForms);
  app.get(
    '/',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.findForms,
    },
    AssistanceController.findForms
  );
  app.delete(
    '/forms',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.deleteForms,
    },
    AssistanceController.deleteForms
  );
  app.patch(
    '/',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.modifyForm,
    },
    AssistanceController.modifyForm
  );
  app.get(
    '/id',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.getFormById,
    },
    AssistanceController.getFormById
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

  app.post(
    '/report',
    { onRequest: [useAuthGuard, useRoleGuard(['admin'])], schema: AssistanceSchemas.createReport },
    AssistanceController.getReport
  );

  app.post(
    '/list',
    {
      // onRequest: [useAuthGuard]
    },
    AssistanceController.uploadListCSV
  );
}
