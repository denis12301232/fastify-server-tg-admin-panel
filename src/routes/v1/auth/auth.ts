import type { FastifyInstance } from 'fastify';
import AuthController from '@/api/controllers/AuthController.js';
import AuthSchemas from '@/api/schemas/AuthSchemas.js';

export default async function AuthRoutes(app: FastifyInstance) {
  app.post('/registration', { schema: AuthSchemas.registration }, AuthController.registration);
  app.post('/login', { schema: AuthSchemas.login }, AuthController.login);
  app.get('/logout', AuthController.logout);
  app.get('/refresh', AuthController.refresh);
  app.get('/activate/:link', { schema: AuthSchemas.activate }, AuthController.activate);
  app.post('/restore/password', { schema: AuthSchemas.restorePassword }, AuthController.restorePassword);
  app.post('/set/password', { schema: AuthSchemas.setNewPassword }, AuthController.setNewPassword);
  app.get('/oauth2/google/callback', {}, AuthController.googleOAuth2);
  app.get('/oauth2/facebook/callback', {}, AuthController.facebookOAuth2);
}
