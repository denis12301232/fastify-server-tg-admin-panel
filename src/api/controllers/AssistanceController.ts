import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AssistanceTypes } from '@/types/index.js';
import { AssistanceService } from '@/api/services/index.js';
import ApiError from '@/exceptions/ApiError.js';
import Validate from '@/util/Validate.js';

export default class AssistanceController {
  static async saveForm(request: FastifyRequest<AssistanceTypes.SaveForm>) {
    const saved = await AssistanceService.saveForm(request.body);
    return { message: 'Saved!', saved };
  }

  static async getForms(request: FastifyRequest<AssistanceTypes.GetForms>, reply: FastifyReply) {
    const { forms, total } = await AssistanceService.getForms(request.body);
    reply.header('X-Total-Count', total);
    return forms;
  }

  static async findForms(request: FastifyRequest<AssistanceTypes.FindForms>, reply: FastifyReply) {
    const { nameOrSurname, limit, page } = request.query;
    const { forms, count } = await AssistanceService.findForms(nameOrSurname, limit, page);
    reply.header('X-Total-Count', count);
    return forms;
  }

  static async deleteForms(request: FastifyRequest<AssistanceTypes.DeleteForms>) {
    const ids = request.body;
    const deleteResult = await AssistanceService.deleteForms(ids);
    return deleteResult;
  }

  static async modifyForm(request: FastifyRequest<AssistanceTypes.ModifyForm>) {
    const { form, id } = request.body;
    const updateResult = await AssistanceService.modifyForm(id, form);
    return updateResult;
  }

  static async getFormById(request: FastifyRequest<AssistanceTypes.GetFormById>) {
    const { id } = request.query;
    const form = await AssistanceService.getFormById(id);
    return form;
  }

  static async saveFormsToGoogleSheets(request: FastifyRequest<AssistanceTypes.SaveFormsToSheets>) {
    const result = await AssistanceService.saveFormsToSheet(request.body);
    return result;
  }

  static async getStats(request: FastifyRequest<AssistanceTypes.GetStats>) {
    const filters = request.query;
    const result = await AssistanceService.getStats(filters);
    return result;
  }

  static async getReport(request: FastifyRequest<AssistanceTypes.CreateReport>, reply: FastifyReply) {
    const result = await AssistanceService.createReport(request.body);
    return reply.header('Content-Type', 'application/octet-stream').send(result);
  }

  static async uploadListCSV(request: FastifyRequest<AssistanceTypes.UploadListCSV>) {
    const file = await request.file();

    if (!file || Validate.isValidMime(['text/csv'])) {
      throw ApiError.BadRequest(400, 'Wrong query');
    }

    const result = await AssistanceService.uploadListCSV(file, request.query.locale);
    return result;
  }

  static async createReport(request: FastifyRequest<AssistanceTypes.CreateReport>) {
    const rep = await AssistanceService.createReport(request.body);
    return rep;
  }
}
