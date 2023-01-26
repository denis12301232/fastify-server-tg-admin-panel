import type { FastifyInstance } from 'fastify'
import { ToolsController } from '@/api/controllers/ToolsController'
import { ToolsSchemas } from '@/api/schemas/ToolsSchemas'
import { useAuthGuard, useRoleGuard } from '@/hooks'


export default async function ToolsRoutes(fastify: FastifyInstance) {
   fastify.patch('/name', {
      onRequest: useAuthGuard,
      schema: ToolsSchemas.setNewNameBody
   }, ToolsController.setNewName);

   fastify.patch('/email', {
      onRequest: useAuthGuard,
      schema: ToolsSchemas.setNewEmailBody
   }, ToolsController.setNewEmail);

   fastify.patch('/password', {
      onRequest: useAuthGuard,
      schema: ToolsSchemas.setNewPasswordBody
   }, ToolsController.setNewPassword);

   fastify.post('/google/service', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: ToolsSchemas.setGoogleServiceAccountSettingsBody
   }, ToolsController.setGoogleServiceAccountSettings);

   fastify.get('/users', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: ToolsSchemas.getUsersQuery
   }, ToolsController.getUsers);

   fastify.post('/setroles', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: ToolsSchemas.updateRolesBody
   }, ToolsController.updateRoles);

   fastify.post('/avatar', {
      onRequest: [useAuthGuard]
   }, ToolsController.setAvatar);
}