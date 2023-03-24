import type { AssistanceTypes } from '@/types'
import Joi from 'joi'
import { Validate, Constants } from '@/util'


export class AssistanceSchemas {
   static readonly saveFormBody = {
      body: Joi.object<AssistanceTypes.SaveFormBody>().keys({
         name: Joi.string().required().max(50),
         surname: Joi.string().required().max(50),
         patronymic: Joi.string().required().max(50),
         phone: Joi.string().required(),
         birth: Joi.string().required().custom((value: string, helper) => {
            return Validate.isYYYYMMDD(value) ? value : helper.error('any.invalid');
         }),
         district: Joi.string().required().valid(...Constants.districts),
         street: Joi.string().required().max(50),
         house: Joi.string().required().max(50),
         flat: Joi.string().max(50).pattern(/^\d+$/).required(),
         people_num: Joi.number().min(1).max(10).required(),
         people_fio: Joi.array().min(1),
         invalids: Joi.boolean(),
         kids: Joi.boolean(),
         kids_age: Joi.array().valid('0-1', '1-3', '3-9', '9-18'),
         food: Joi.boolean(),
         water: Joi.boolean(),
         medicines: Joi.boolean(),
         medicines_info: Joi.string().max(100),
         hygiene: Joi.boolean(),
         hygiene_info: Joi.string().max(100),
         pampers: Joi.boolean(),
         pampers_info: Joi.string().max(100),
         diet: Joi.string().max(100),
         pers_data_agreement: Joi.boolean().required().valid('true'),
         photo_agreement: Joi.boolean().required().valid('true')
      }).required()
   }

   static readonly getFormsQuery = {
      querystring: Joi.object<AssistanceTypes.GetFormsQuery>().keys({
         nameOrSurname: Joi.string().required(),
         limit: Joi.number().required().min(1).max(100),
         page: Joi.number().required()
      }).required()
   }

   static readonly getHumansListQuery = {
      querystring: Joi.object<AssistanceTypes.GetHumansListQuery>().keys({
         limit: Joi.number().required(),
         page: Joi.number().required(),
         filter: Joi.string().allow(''),
         sort: Joi.string().allow('').valid('fio'),
         descending: Joi.boolean().required()
      }).required()
   }

   static readonly deleteFormByIdBody = {
      body: Joi.object<AssistanceTypes.DeleteFormByIdBody>().keys({
         id: Joi.string().required()
      }).required()
   }

   static readonly modifyFormBody = {
      body: Joi.object<AssistanceTypes.ModifyFormBody>().keys({
         id: Joi.string().required(),
         form: Joi.object().required()
      }).required()
   }

   static readonly getFormByIdQuery = {
      querystring: Joi.object<AssistanceTypes.GetFormByIdQuery>().keys({
         id: Joi.string().required()
      }).required()
   }

   static readonly saveFormsToGoogleSheetsBody = {
      body: Joi.object<AssistanceTypes.SaveFormsToSheetsBody>().keys({
         district: Joi.string().allow('').custom((value, helper) => {
            return Validate.isValidDistrict(value) ? value : helper.error('any.invalid');
         }),
         birth: Joi.object<{ from: string; to: string }>().keys({
            from: Joi.number().required().min(1920).max(2022),
            to: Joi.number().required().min(1920).max(2022)
         })
      }).required()
   }
}