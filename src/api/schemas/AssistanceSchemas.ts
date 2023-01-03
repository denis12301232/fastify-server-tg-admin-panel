import type { AssistanceTypes } from '@/types/queries'
import Joi from 'joi'
import Validate from '@/util/Validate'


export class AssistanceSchemas {
   static readonly getFormsQuery = {
      querystring: Joi.object<AssistanceTypes.GetFormsQuery>().keys({
         name: Joi.string().required(),
         surname: Joi.string().required(),
         patronymic: Joi.string().required()
      }).required()
   }

   static readonly getHumansListQuery = {
      querystring: Joi.object<AssistanceTypes.GetHumansListQuery>().keys({
         limit: Joi.number().required(),
         page: Joi.number().required()
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
         district: Joi.string().custom((value, helper) => {
            return Validate.isValidDistrict(value) ? value : helper.error('any.invalid');
         }),
         birth: Joi.object<{ from: string; to: string }>().keys({
            from: Joi.number().required().min(1920).max(2022),
            to: Joi.number().required().min(1920).max(2022)
         })
      }).required()
   }
}