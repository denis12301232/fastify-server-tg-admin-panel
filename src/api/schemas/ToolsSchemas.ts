import type { ToolsTypes } from '@/types/index.js';
import Joi from 'joi';
import { Validate } from '@/util/index.js';

export default class ToolsSchemas {
  static readonly setNewNameBody = Joi.object<ToolsTypes.SetNewNameBody>()
    .keys({
      name: Joi.string().required(),
    })
    .required();

  static readonly setNewEmailBody = Joi.object<ToolsTypes.SetNewEmailBody>()
    .keys({
      email: Joi.string()
        .required()
        .custom((value, helper) => {
          return Validate.isEmail(value) ? value : helper.error('any.invalid');
        })
        .required(),
    })
    .required();

  static readonly setNewPasswordBody = Joi.object<ToolsTypes.SetNewPasswordBody>()
    .keys({
      oldPassword: Joi.string().required().max(20),
      newPassword: Joi.string().required().min(6).max(20),
    })
    .required();

  static readonly setGoogleServiceAccountSettingsBody = Joi.object<ToolsTypes.SetGoogleServiceAccountSettingsBody>()
    .keys({
      serviceUser: Joi.string().allow(''),
      servicePrivateKey: Joi.string().allow(''),
      sheetId: Joi.string().allow(''),
      folderId: Joi.string().allow(''),
    })
    .or('serviceUser', 'servicePrivateKey', 'sheetId', 'folderId');

  static readonly updateRolesBody = Joi.object<ToolsTypes.UpdateRolesBody>()
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
    .required();

  static readonly getUsersQuery = Joi.object<ToolsTypes.GetUsersQuery>()
    .keys({
      limit: Joi.number().required().max(50),
      page: Joi.number().required().min(1),
      filter: Joi.string().allow(''),
    })
    .required();
}
