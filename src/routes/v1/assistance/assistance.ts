import type { FastifyInstance } from 'fastify'
import { AssistanceController } from '@/api/controllers/AssistanceController'
import { AssistanceSchemas } from '@/api/schemas/AssistanceSchemas'
import { useAuthGuard, useRoleGuard } from '@/hooks'


export default async function AssistanceRoutes(fastify: FastifyInstance) {
   fastify.post('/', 
   
   AssistanceController.saveForm);

   fastify.get('/', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.getFormsQuery,
   }, AssistanceController.getForms);

   fastify.get('/list', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.getHumansListQuery
   }, AssistanceController.getHumansList);

   fastify.delete('/', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.deleteFormByIdBody
   }, AssistanceController.deleteFormById);

   fastify.patch('/', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.modifyFormBody
   }, AssistanceController.modifyForm);

   fastify.get('/id', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.getFormByIdQuery
   }, AssistanceController.getFormById);

   fastify.post('/sheet', {
      onRequest: [useAuthGuard, useRoleGuard(['admin'])],
      schema: AssistanceSchemas.saveFormsToGoogleSheetsBody
   }, AssistanceController.saveFormsToGoogleSheets);
}