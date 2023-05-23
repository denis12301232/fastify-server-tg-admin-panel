import type { AssistanceTypes, IAssistance } from '@/types/index.js';
import Joi from 'joi';
import { Validate, Constants } from '@/util/index.js';

export default class AssistanceSchemas {
  static readonly saveFormBody = Joi.object<IAssistance>()
    .keys({
      name: Joi.string().required().max(50),
      surname: Joi.string().required().max(50),
      patronymic: Joi.string().required().max(50),
      phone: Joi.string().required(),
      birth: Joi.string()
        .required()
        .custom((value: string, helper) => {
          return Validate.isYYYYMMDD(value) ? value : helper.error('any.invalid');
        }),
      district: Joi.string()
        .required()
        .valid(...Constants.districts),
      street: Joi.string().required().max(50),
      house: Joi.string().required().max(50),
      flat: Joi.string().max(50).pattern(/^\d+$/).required(),
      people_num: Joi.number().min(1).max(10).required(),
      people_fio: Joi.array(),
      invalids: Joi.boolean(),
      kids: Joi.boolean(),
      kids_age: Joi.array().items(Joi.string().valid('0-1', '1-3', '3-9', '9-18')).empty(Joi.array().length(0)),
      food: Joi.boolean(),
      water: Joi.boolean(),
      medicines: Joi.boolean(),
      medicines_info: Joi.string().max(100).allow('', null),
      hygiene: Joi.boolean(),
      hygiene_info: Joi.string().max(100).allow('', null),
      pampers: Joi.boolean(),
      pampers_info: Joi.string().max(100).allow('', null),
      diet: Joi.string().max(100).allow(''),
      pers_data_agreement: Joi.boolean().required().valid(true),
      photo_agreement: Joi.boolean().required().valid(true),
    })
    .required();

  static readonly getFormsQuery = Joi.object<AssistanceTypes.GetFormsQuery>()
    .keys({
      nameOrSurname: Joi.string().required(),
      limit: Joi.number().required().min(1).max(100),
      page: Joi.number().required(),
    })
    .required();

  static readonly getHumansListQuery = Joi.object<AssistanceTypes.GetHumansListQuery>()
    .keys({
      limit: Joi.number().required(),
      page: Joi.number().required(),
      filter: Joi.string().allow(''),
      sort: Joi.string().allow('').valid('fio'),
      descending: Joi.boolean().required(),
    })
    .required();

  static readonly deleteFormByIdBody = Joi.object<AssistanceTypes.DeleteFormByIdBody>()
    .keys({
      id: Joi.string().required(),
    })
    .required();

  static readonly modifyFormBody = Joi.object<AssistanceTypes.ModifyFormBody>()
    .keys({
      id: Joi.string().required(),
      form: Joi.object().required(),
    })
    .required();

  static readonly getFormByIdQuery = Joi.object<AssistanceTypes.GetFormByIdQuery>()
    .keys({
      id: Joi.string().required(),
    })
    .required();

  static readonly saveFormsToGoogleSheetsBody = Joi.object<AssistanceTypes.SaveFormsToSheetsBody>()
    .keys({
      district: Joi.string()
        .allow('')
        .valid(...Constants.districts),
      birth: Joi.object<{ from: string; to: string }>().keys({
        from: Joi.number().required().min(1920).max(2022),
        to: Joi.number().required().min(1920).max(2022),
      }),
    })
    .required();

  static readonly getStatsQuery = Joi.object<AssistanceTypes.GetStatsQuery>({
    by: Joi.string().required().valid('month', 'day'),
    timestamp: Joi.number().required(),
  }).required();
}
