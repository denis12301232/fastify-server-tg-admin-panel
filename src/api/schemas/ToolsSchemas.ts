import type { ToolsTypes } from '@/types/index.js';
import Joi from 'joi';

export default class ToolsSchemas {
  static readonly setGoogleServiceAccountSettings = {
    body: Joi.object<ToolsTypes.SetGoogleServiceAccountSettings['Body']>()
      .keys({
        serviceUser: Joi.string().allow(''),
        servicePrivateKey: Joi.string().allow(''),
        sheetId: Joi.string().allow(''),
        folderId: Joi.string().allow(''),
      })
      .or('serviceUser', 'servicePrivateKey', 'sheetId', 'folderId'),
  };
}
