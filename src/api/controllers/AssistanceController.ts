import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AssistanceTypes } from '@/types/index.js';
import { AssistanceService } from '@/api/services/index.js';
import ApiError from '@/exceptions/ApiError.js';
import Validate from '@/util/Validate.js';

export default class AssistanceController {
  static async store(request: FastifyRequest<AssistanceTypes.Store>) {
    const saved = await AssistanceService.store(request.body);
    return saved;
  }

  static async destroy(request: FastifyRequest<AssistanceTypes.Destroy>) {
    const deleteResult = await AssistanceService.destroy(request.body);
    return deleteResult;
  }

  static async catch(request: FastifyRequest<AssistanceTypes.Catch>, reply: FastifyReply) {
    const { forms, total } = await AssistanceService.catch(request.body);
    reply.header('X-Total-Count', total);
    return forms;
  }

  static async update(request: FastifyRequest<AssistanceTypes.Update>) {
    const updateResult = await AssistanceService.update(request.params.id, request.body);
    return updateResult;
  }

  static async show(request: FastifyRequest<AssistanceTypes.Show>) {
    const form = await AssistanceService.show(request.params.id);
    return form;
  }

  static async saveFormsToGoogleSheets(request: FastifyRequest<AssistanceTypes.SaveFormsToSheets>) {
    const result = await AssistanceService.saveFormsToSheet(request.body);
    return result;
  }

  static async getStats(request: FastifyRequest<AssistanceTypes.GetStats>) {
    const result = await AssistanceService.getStats(request.query);
    return result;
  }

  static async getStatsPdf(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();

    if (!data) {
      throw ApiError.BadRequest();
    }

    const stream = await AssistanceService.createStatsPdf(data);
    return reply.header('Content-Type', 'application/octet-stream').send(stream);
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

  static async createReport(request: FastifyRequest<AssistanceTypes.CreateReport>, reply: FastifyReply) {
    const result = await AssistanceService.createReport(request.body);
    return reply.header('Content-Type', 'application/octet-stream').send(result);
  }
}
