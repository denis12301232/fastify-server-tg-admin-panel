import type { FastifyInstance } from 'fastify';
import AuthController from '@/api/controllers/AuthController.js';
import AuthSchemas from '@/api/schemas/AuthSchemas.js';

export default async function AuthRoutes(app: FastifyInstance) {
  app.post('/registration', { schema: AuthSchemas.userRegistration }, AuthController.registration);
  app.post('/login', { schema: AuthSchemas.userLogin }, AuthController.login);
  app.get('/logout', AuthController.logout);
  app.get('/refresh', AuthController.refresh);
  app.get('/activate/:link', { schema: AuthSchemas.userActivate }, AuthController.activate);
  app.post('/restore/password', { schema: AuthSchemas.userPasswordRestore }, AuthController.restorePassword);
  app.post('/set/password', { schema: AuthSchemas.userNewRestoredPassword }, AuthController.setNewPassword);
}
