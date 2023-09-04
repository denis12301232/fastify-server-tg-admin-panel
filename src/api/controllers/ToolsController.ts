import type { FastifyRequest } from 'fastify';
import type { ToolsTypes } from '@/types/index.js';
import { ToolsService } from '@/api/services/index.js';

export default class ToolsController {
  static async setGoogleServiceAccountSettings(request: FastifyRequest<ToolsTypes.SetGoogleServiceAccountSettings>) {
    await ToolsService.setGoogleServiceAccountSettings(request.body);
    return { message: 'Saved' };
  }
}
