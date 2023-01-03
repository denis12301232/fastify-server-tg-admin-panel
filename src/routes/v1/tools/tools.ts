import type { FastifyInstance } from 'fastify'
import { ToolsController } from '@/api/controllers/ToolsController'
import { ToolsSchemas } from '@/api/schemas/ToolsSchemas'
import { useAuth, useRoleGuard } from '@/hooks/hooks'


export default async function ToolsRoutes(fastify: FastifyInstance) {
   fastify.patch('/name', {
      onRequest: useAuth,
      schema: ToolsSchemas.setNewNameBody
   }, ToolsController.setNewName);

   fastify.patch('/email', {
      onRequest: useAuth,
      schema: ToolsSchemas.setNewEmailBody
   }, ToolsController.setNewEmail);

   fastify.patch('/password', {
      onRequest: useAuth,
      schema: ToolsSchemas.setNewPasswordBody
   }, ToolsController.setNewPassword);

   fastify.post('/google/service', {
      onRequest: [useAuth, useRoleGuard(['admin'])],
      schema: ToolsSchemas.setGoogleServiceAccountSettingsBody
   }, ToolsController.setGoogleServiceAccountSettings);

   fastify.get('/users', {
      onRequest: [useAuth, useRoleGuard(['admin'])]
   }, ToolsController.getUsers);

   fastify.post('/setroles', {
      onRequest: [useAuth, useRoleGuard(['admin'])],
      schema: ToolsSchemas.updateRolesBody
   }, ToolsController.updateRoles);
}