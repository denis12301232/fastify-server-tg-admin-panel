import type { FastifyInstance } from 'fastify';
import ToolsController from '@/api/controllers/ToolsController.js';
import ToolsSchemas from '@/api/schemas/ToolsSchemas.js';
import { useAuthGuard, useRoleGuard } from '@/hooks/index.js';

export default async function ToolsRoutes(app: FastifyInstance) {
  app.patch(
    '/name',
    {
      onRequest: useAuthGuard,
      schema: ToolsSchemas.setNewName,
    },
    ToolsController.updateName
  );
  app.patch(
    '/email',
    {
      onRequest: useAuthGuard,
      schema: ToolsSchemas.setNewEmail,
    },
    ToolsController.updateEmail
  );
  app.patch(
    '/password',
    {
      onRequest: useAuthGuard,
      schema: ToolsSchemas.setNewPassword,
    },
    ToolsController.updatePassword
  );
  app.post(
    '/google/service',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: ToolsSchemas.setGoogleServiceAccountSettings,
    },
    ToolsController.setGoogleServiceAccountSettings
  );
  app.get(
    '/users',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: ToolsSchemas.getUsers,
    },
    ToolsController.getUsers
  );
  app.patch(
    '/roles',
    {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: ToolsSchemas.updateRoles,
    },
    ToolsController.updateRoles
  );
  app.patch(
    '/avatar',
    {
      onRequest: [useAuthGuard],
    },
    ToolsController.updateAvatar
  );
}
