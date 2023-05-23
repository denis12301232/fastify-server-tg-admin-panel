import type { FastifyInstance } from 'fastify';
import AuthController from '@/api/controllers/AuthController.js';
import AuthSchemas from '@/api/schemas/AuthSchemas.js';

export default async function AuthRoutes (app: FastifyInstance) {
  app.post('/registration', { schema: { body: AuthSchemas.userRegistrationBody } }, AuthController.registration);
  app.post('/login', { schema: { body: AuthSchemas.userLoginBody } }, AuthController.login);
  app.get('/logout', AuthController.logout);
  app.get('/refresh', AuthController.refresh);
  app.get('/activate/:link', { schema: { params: AuthSchemas.userActivateParams } }, AuthController.activate);
  app.post(
    '/restore/password',
    { schema: { body: AuthSchemas.userPasswordRestoreBody } },
    AuthController.restorePassword
  );
  app.post(
    '/restore/password/new',
    { schema: { body: AuthSchemas.userNewRestoredPasswordBody } },
    AuthController.setNewRestoredPassword
  );
}
