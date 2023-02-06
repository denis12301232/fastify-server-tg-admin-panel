import type { FastifyRequest, FastifyReply } from 'fastify'
import type { AssistanceTypes } from '@/types/queries'
import { AssistanceService } from '@/api/services'


export class AssistanceController {
   static async saveForm(request: FastifyRequest<{ Body: AssistanceTypes.SaveFormBody }>, reply: FastifyReply) {
      try {
         const { form } = request.body;
         const saved = await AssistanceService.saveForm(form);
         return { message: 'Успешно сохранено!', saved };
      } catch (e) {
         throw e;
      }
   }

   static async getForms(request: FastifyRequest<{ Querystring: AssistanceTypes.GetFormsQuery }>, reply: FastifyReply) {
      try {
         const { nameOrSurname, limit, page } = request.query;
         const { forms, count } = await AssistanceService.getForms(nameOrSurname, limit, page);
         reply.header('X-Total-Count', count);
         return forms;
      } catch (e) {
         throw e;
      }
   }

   static async getHumansList(request: FastifyRequest<{ Querystring: AssistanceTypes.GetHumansListQuery }>, reply: FastifyReply) {
      try {
         const { limit, page } = request.query;
         const { humansList, count } = await AssistanceService.getHumansList(limit, page);
         reply.header('X-Total-Count', count);
         return humansList;
      } catch (e) {
         throw e;
      }
   }

   static async deleteFormById(request: FastifyRequest<{ Body: AssistanceTypes.DeleteFormByIdBody }>, reply: FastifyReply) {
      try {
         const { id } = request.body;
         const deleteResult = await AssistanceService.deleteFormById(id);
         return deleteResult;
      } catch (e) {
         throw e;
      }
   }

   static async modifyForm(request: FastifyRequest<{ Body: AssistanceTypes.ModifyFormBody }>, reply: FastifyReply) {
      try {
         const { form, id } = request.body;
         const updateResult = await AssistanceService.modifyForm(id, form);
         return updateResult;
      } catch (e) {
         throw e;
      }
   }

   static async getFormById(request: FastifyRequest<{ Querystring: AssistanceTypes.GetFormByIdQuery }>, reply: FastifyReply) {
      try {
         const { id } = request.query;
         const form = await AssistanceService.getFormById(id);
         return form;
      } catch (e) {
         throw e;
      }
   }

   static async saveFormsToGoogleSheets(request: FastifyRequest<{ Body: AssistanceTypes.SaveFormsToSheetsBody }>, reply: FastifyReply) {
      try {
         const filters = request.body;
         const result = await AssistanceService.saveFormsToSheet(filters);
         return result;
      } catch (e) {
         throw e;
      }
   }
}