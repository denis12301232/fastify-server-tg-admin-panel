import type { FastifyRequest, FastifyReply } from 'fastify'
import type { AssistanceTypes } from '@/types'
import { AssistanceService } from '@/api/services'


export class AssistanceController {
   static async saveForm(request: FastifyRequest<{ Body: AssistanceTypes.SaveFormBody }>) {
      const saved = await AssistanceService.saveForm(request.body);
      return { message: 'Успешно сохранено!', saved };
   }

   static async getForms(request: FastifyRequest<{ Querystring: AssistanceTypes.GetFormsQuery }>, reply: FastifyReply) {
      const { nameOrSurname, limit, page } = request.query;
      const { forms, count } = await AssistanceService.getForms(nameOrSurname, limit, page);
      reply.header('X-Total-Count', count);
      return forms;
   }

   static async getHumansList(request: FastifyRequest<{ Querystring: AssistanceTypes.GetHumansListQuery }>, reply: FastifyReply) {
      const { humansList, count } = await AssistanceService.getHumansList(request.query);
      reply.header('X-Total-Count', count);
      return humansList;
   }

   static async deleteFormById(request: FastifyRequest<{ Body: AssistanceTypes.DeleteFormByIdBody }>) {
      const { id } = request.body;
      const deleteResult = await AssistanceService.deleteFormById(id);
      return deleteResult;
   }

   static async modifyForm(request: FastifyRequest<{ Body: AssistanceTypes.ModifyFormBody }>) {
      const { form, id } = request.body;
      const updateResult = await AssistanceService.modifyForm(id, form);
      return updateResult;
   }

   static async getFormById(request: FastifyRequest<{ Querystring: AssistanceTypes.GetFormByIdQuery }>) {
      const { id } = request.query;
      const form = await AssistanceService.getFormById(id);
      return form;
   }

   static async saveFormsToGoogleSheets(request: FastifyRequest<{ Body: AssistanceTypes.SaveFormsToSheetsBody }>) {
      const filters = request.body;
      const result = await AssistanceService.saveFormsToSheet(filters);
      return result;
   }

   static async getStats(request: FastifyRequest<{ Querystring: AssistanceTypes.GetStatsQuery }>) {
      const filters = request.query;
      const result = await AssistanceService.getStats(filters);
      return result;
   }
}