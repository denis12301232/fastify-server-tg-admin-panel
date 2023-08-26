import type { AssistanceTypes, IAssistance } from '@/types/index.js';
import Joi from 'joi';
import { Validate } from '@/util/index.js';

const year = new Date().getFullYear();

export default class AssistanceSchemas {
  static readonly saveForm = {
    body: Joi.object<IAssistance>()
      .keys({
        name: Joi.string().required().max(100),
        surname: Joi.string().required().max(100),
        patronymic: Joi.string().required().max(100),
        phone: Joi.string()
          .length(10)
          .pattern(/^[0-9]+$/)
          .required(),
        birth: Joi.string()
          .required()
          .custom((value: string, helper) => {
            return Validate.isYYYYMMDD(value) ? value : helper.error('any.invalid');
          }),
        district: Joi.number().required().valid(0, 1, 2, 3, 4, 5, 6, 7, 8),
        street: Joi.number().required(),
        house: Joi.string().required().max(50),
        flat: Joi.string().max(50).pattern(/^\d+$/).required(),
        peopleCount: Joi.number().min(1).max(10).required(),
        peopleFio: Joi.array().items(Joi.string().max(100)).empty(Joi.array().length(0)),
        invalids: Joi.boolean(),
        kids: Joi.boolean(),
        kidsAge: Joi.array().items(Joi.string().valid('0-1', '1-3', '3-9', '9-18')).empty(Joi.array().length(0)),
        food: Joi.boolean(),
        water: Joi.boolean(),
        medicines: Joi.boolean(),
        medicinesInfo: Joi.string().max(500).allow('', null),
        hygiene: Joi.boolean(),
        hygieneInfo: Joi.string().max(500).allow('', null),
        pampers: Joi.boolean(),
        pampersInfo: Joi.string().max(500).allow('', null),
        extraInfo: Joi.string().max(500).allow('', null),
        personalDataAgreement: Joi.boolean().required().valid(true),
        photoAgreement: Joi.boolean().required().valid(true),
        sector: Joi.string(),
      })
      .required(),
  };

  static readonly findForms = {
    querystring: Joi.object<AssistanceTypes.FindForms['Querystring']>()
      .keys({
        nameOrSurname: Joi.string().required(),
        limit: Joi.number().required().min(1).max(100),
        page: Joi.number().required(),
      })
      .required(),
  };

  static readonly getForms = {
    body: Joi.object<AssistanceTypes.GetForms['Body']>()
      .keys({
        limit: Joi.number().required(),
        page: Joi.number().required(),
        sort: Joi.string().required(),
        descending: Joi.boolean().required(),
        filter: Joi.object<AssistanceTypes.GetForms['Body']['filter']>().keys({
          district: Joi.number().allow('').valid(0, 1, 2, 3, 4, 5, 6, 7, 8),
          birth: Joi.object<{ min: number; max: number }>().keys({
            min: Joi.number().required().min(1920).max(year),
            max: Joi.number().required().min(1920).max(year),
          }),
          street: Joi.string().allow(''),
          sector: Joi.string().allow(''),
        }).allow('', null),
      })
      .required(),
  };

  static readonly deleteForms = {
    body: Joi.array<AssistanceTypes.DeleteForms['Body']>().required().items(Joi.string()),
  };

  static readonly modifyForm = {
    body: Joi.object<AssistanceTypes.ModifyForm['Body']>()
      .keys({
        id: Joi.string().required(),
        form: Joi.object<AssistanceTypes.ModifyForm['Body']['form']>()
          .keys({
            _id: Joi.string(),
            name: Joi.string().required().max(100),
            surname: Joi.string().required().max(100),
            patronymic: Joi.string().required().max(100),
            phone: Joi.string()
              .length(10)
              .pattern(/^[0-9]+$/)
              .required(),
            birth: Joi.string()
              .required()
              .custom((value: string, helper) => {
                return Validate.isYYYYMMDD(value) ? value : helper.error('any.invalid');
              }),
            district: Joi.number().required().valid(0, 1, 2, 3, 4, 5, 6, 7, 8),
            street: Joi.number().required().max(50),
            house: Joi.string().required().max(50),
            flat: Joi.number().required(),
            peopleCount: Joi.number().min(1).max(10).required(),
            peopleFio: Joi.array().items(Joi.string().max(100)).empty(Joi.array().length(0)),
            invalids: Joi.boolean(),
            kids: Joi.boolean(),
            kidsAge: Joi.array().items(Joi.string().valid('0-1', '1-3', '3-9', '9-18')).empty(Joi.array().length(0)),
            food: Joi.boolean(),
            water: Joi.boolean(),
            medicines: Joi.boolean(),
            medicinesInfo: Joi.string().max(500).allow('', null),
            hygiene: Joi.boolean(),
            hygieneInfo: Joi.string().max(500).allow('', null),
            pampers: Joi.boolean(),
            pampersInfo: Joi.string().max(500).allow('', null),
            extraInfo: Joi.string().max(500).allow('', null),
            personalDataAgreement: Joi.boolean().required().valid(true),
            photoAgreement: Joi.boolean().required().valid(true),
            sector: Joi.string().allow(''),
          })
          .required(),
      })
      .required(),
  };

  static readonly getFormById = {
    params: Joi.object<AssistanceTypes.GetFormById['Querystring']>()
      .keys({
        id: Joi.string().required(),
      })
      .required(),
      
  };

  static readonly saveFormsToGoogleSheets = {
    body: Joi.object<AssistanceTypes.SaveFormsToSheets['Body']>()
      .keys({
        locale: Joi.string().required().valid('ru', 'uk', 'en'),
        ids: Joi.array().items(Joi.string()).required(),
      })
      .required(),
  };

  static readonly getStats = {
    querystring: Joi.object<AssistanceTypes.GetStats['Querystring']>({
      by: Joi.string().required().valid('month', 'year'),
      timestamp: Joi.number().required(),
    }).required(),
  };

  static readonly createReport = {
    body: Joi.object<AssistanceTypes.CreateReport['Body']>()
      .keys({
        locale: Joi.string().required().valid('ru', 'uk', 'en'),
        type: Joi.string().required().valid('xlsx', 'csv'),
        ids: Joi.array().items(Joi.string()).required(),
      })
      .required(),
  };
}
