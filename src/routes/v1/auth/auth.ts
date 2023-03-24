import type { FastifyInstance } from 'fastify'
import { AuthController } from '@/api/controllers/AuthController'
import { AuthSchemas } from '@/api/schemas/AuthSchemas'


export default async function AuthRoutes(fastify: FastifyInstance) {
   fastify.post('/registration', {
      schema: AuthSchemas.userRegistrationBody
   }, AuthController.registration);

   fastify.post('/login', {
      schema: AuthSchemas.userLoginBody
   }, AuthController.login);

   fastify.get('/logout', AuthController.logout);

   fastify.get('/refresh', AuthController.refresh);

   fastify.get('/activate/:link', {
      schema: AuthSchemas.userActivateParams
   }, AuthController.activate);

   fastify.post('/restore/password', {
      schema: AuthSchemas.userPasswordRestoreBody
   }, AuthController.restorePassword);

   fastify.post('/restore/password/new', {
      schema: AuthSchemas.userNewRestoredPasswordBody
   }, AuthController.setNewRestoredPassword);
}