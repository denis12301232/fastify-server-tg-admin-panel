import type { AssistanceTypes } from '@/types/queries'
import type { AssistanceForm, AnyObject } from '@/types/interfaces'
import type { Types, FilterQuery } from 'mongoose'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { AssistanceModel, ToolsModel } from '@/models/mongo'
import { Constants } from '@/util'
import ApiError from '@/exeptions/ApiError'


export class AssistanceService {
   static async saveForm(form: AssistanceForm) {
      const saved = await AssistanceModel.create(form)
         .catch(e => { throw ApiError.BadRequest(e.message, e.errors) });
      return saved;
   }

   static async getForms(nameOrSurname: string, limit: number, page: number) {
      const skip = (page - 1) * limit;
      const form = await AssistanceModel.find({
         $or: [{
            name: { $regex: nameOrSurname },
            surname: { $regex: nameOrSurname }
         }]
      }, { __v: 0 }).lean();
      const count = form.length;
      form.splice(0, skip);
      form.length ? form.length = limit : '';
      if (!form.length) {
         throw ApiError.BadRequest(400, `Увы, ничего не найдено по запросу ${nameOrSurname}`);
      }

      const forms = form.reduce((box: Array<{ _id: Types.ObjectId, form: AssistanceForm }>, item) => {
         return [...box, {
            _id: item._id,
            form: Object.fromEntries(Object.entries(item).filter(([key]) => key !== '_id'))
         }] as Array<{ _id: Types.ObjectId, form: AssistanceForm }>
      }, []);

      return { forms: forms, count }
   }

   static async getHumansList(limit: number, page: number, filter: string) {
      const query = filter
         ? {
            $or: [
               { surname: { $regex: filter, $options: 'i' } },
               { name: { $regex: filter, $options: 'i' } },
               { patronymic: { $regex: filter, $options: 'i' } },
            ]
         }
         : {};

      const skip = (page - 1) * limit;
      const humansList = await AssistanceModel.find(query, { name: 1, surname: 1, patronymic: 1, _id: 1 })
         .lean();
      const count = humansList.length;
      humansList.splice(0, skip);
      humansList.length ? humansList.length = limit : '';

      return {
         humansList: humansList.reduce((box: Array<{ _id: Types.ObjectId, fio: string }>, item) => {
            return [...box, { _id: item._id, fio: `${item.surname} ${item.name} ${item.patronymic}` }]
         }, []),
         count
      };
   }

   static async deleteFormById(id: string) {
      const deleteResult = await AssistanceModel.deleteOne({ _id: id });
      return deleteResult;
   }

   static async modifyForm(id: string, form: AssistanceForm) {
      const updateResult = await AssistanceModel.updateOne({ _id: id }, { $set: form }, { runValidators: true })
         .catch(e => { throw ApiError.BadRequest(e.message, e.errors) });
      return updateResult;
   }

   static async getFormById(id: string) {
      const form = await AssistanceModel.findById(id, { __v: 0, _id: 0 }).lean();
      return form;
   }

   static async saveFormsToSheet(filters: AssistanceTypes.SaveFormsToSheetsBody) {
      const google = await ToolsModel.findOne({ api: 'google' })
         .lean();

      if (!google) {
         return { message: 'Integration not set' };
      }
      const conditions: FilterQuery<AssistanceForm>[] = [];

      if (filters.district) {
         conditions.push({ district: filters.district });
      }
      if (filters.birth?.from && filters.birth?.to) {
         conditions.push({
            $expr: {
               $function: {
                  body: `${function (birth: string, filters: AssistanceTypes.SaveFormsToSheetsBody) {
                     return +birth.split('/')[0] >= +filters.birth.from && +birth.split('/')[0] <= +filters.birth.to
                  }}`,
                  args: ["$birth", filters],
                  lang: "js"
               }
            },
         });
      }

      const finalCondition = conditions.length ? { $and: conditions } : {};
      const forms = await AssistanceModel.find(finalCondition).lean();

      if (!forms.length) throw ApiError.BadRequest(400, 'Nothing was found');

      const doc = new GoogleSpreadsheet(google.settings.sheetId);

      await doc.useServiceAccountAuth({
         client_email: google.settings.serviceUser,
         private_key: google.settings.servicePrivateKey,
      });
      await doc.loadInfo();

      const sheet = doc.sheetsByIndex[0];
      await sheet.clear();
      await sheet.loadCells('A1:Y1');

      const allFields: Array<[any, { display: string }]> = Object.entries(Constants.assistance);
      allFields.forEach(([key, value], index) => {
         const cell = sheet.getCell(0, index);
         cell.value = value.display;
      });
      await sheet.saveUpdatedCells();

      for (const item of forms) {
         const sheetObj = allFields.reduce((obj, [key, value]: [keyof AssistanceForm, { display: string }]) => {
            if (Array.isArray(item[key])) {
               obj[value.display] = (<string[]>item[key])?.join(',');
            } else if (item[key] === true) {
               obj[value.display] = 'Да';
            } else if (item[key] === false) {
               obj[value.display] = 'Нет';
            } else {
               obj[value.display] = item[key];
            }
            return obj;
         }, <AnyObject>{});
         await sheet.addRow(sheetObj);
      }

      return {
         message: 'Successfully formed',
         link: `https://docs.google.com/spreadsheets/d/${google.settings.sheetId}`
      };
   }
}