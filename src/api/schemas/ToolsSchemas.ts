import type { ToolsTypes } from '@/types/index.js';
import Joi from 'joi';
import { Validate } from '@/util/index.js';

export default class ToolsSchemas {
  static readonly setNewName = {
    body: Joi.object<ToolsTypes.SetNewName['Body']>()
      .keys({
        name: Joi.string().required(),
      })
      .required(),
  };

  static readonly setNewEmail = {
    body: Joi.object<ToolsTypes.SetNewEmail['Body']>()
      .keys({
        email: Joi.string()
          .required()
          .custom((value, helper) => {
            return Validate.isEmail(value) ? value : helper.error('any.invalid');
          })
          .required(),
      })
      .required(),
  };

  static readonly setNewPassword = {
    body: Joi.object<ToolsTypes.SetNewPassword['Body']>()
      .keys({
        oldPassword: Joi.string().required().max(20),
        newPassword: Joi.string().required().min(6).max(20),
      })
      .required(),
  };

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

  static readonly updateRoles = {
    body: Joi.object<ToolsTypes.UpdateRoles['Body']>()
      .keys({
        _id: Joi.string().required(),
        roles: Joi.array()
          .required()
          .has(['user'])
          .unique()
          .custom((value, helper) => {
            return Validate.isValidRoles(value) ? value : helper.error('any.invalid');
          }),
      })
      .required(),
  };
}
