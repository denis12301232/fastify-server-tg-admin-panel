import type { FastifyInstance } from 'fastify';
import ToolsController from '@/api/controllers/ToolsController.js';
import ToolsSchemas from '@/api/schemas/ToolsSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function ToolsRoutes(app: FastifyInstance) {
  app.patch(
    '/name',
    {
      onRequest: useAuthGuard,
      schema: { body: ToolsSchemas.setNewNameBody },
    },
    ToolsController.setNewName
  );
  app.patch(
    '/email',
    {
      onRequest: useAuthGuard,
      schema: { body: ToolsSchemas.setNewEmailBody },
    },
    ToolsController.setNewEmail
  );
  app.patch(
    '/password',
    {
      onRequest: useAuthGuard,
      schema: { body: ToolsSchemas.setNewPasswordBody },
    },
    ToolsController.setNewPassword
  );
  app.post(
    '/google/service',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: { body: ToolsSchemas.setGoogleServiceAccountSettingsBody },
    },
    ToolsController.setGoogleServiceAccountSettings
  );
  app.get(
    '/users',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: { querystring: ToolsSchemas.getUsersQuery },
    },
    ToolsController.getUsers
  );
  app.post(
    '/setroles',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: { body: ToolsSchemas.updateRolesBody },
    },
    ToolsController.updateRoles
  );
  app.post(
    '/avatar',
    {
      onRequest: [useAuthGuard],
    },
    ToolsController.setAvatar
  );

  app.get('/locale', { schema: { querystring: ToolsSchemas.getLocaleQuery } }, ToolsController.getLocale);
}
