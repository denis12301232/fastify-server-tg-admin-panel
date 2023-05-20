import type { AssistanceTypes, AssistanceForm, AnyObject } from '@/types'
import type { FilterQuery } from 'mongoose'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { AssistanceModel, ToolsModel } from '@/models/mongo'
import { Constants } from '@/util'
import ApiError from '@/exeptions/ApiError'



export default class AssistanceService {
   static async saveForm(form: AssistanceForm) {
      const saved = await AssistanceModel.create(form);
      return saved;
   }

   static async getForms(nameOrSurname: string, limit: number, page: number) {
      const skip = (page - 1) * limit;
      const forms = await AssistanceModel.find({
         $or: [
            { name: { $regex: nameOrSurname, $options: 'i' } },
            { surname: { $regex: nameOrSurname, $options: 'i' } }
         ]
      }, { __v: 0, createdAt: 0, updatedAt: 0 }).lean();
      if (!forms.length) {
         throw ApiError.BadRequest(400, `Nothing was found at query ${nameOrSurname}`);
      }
      const count = forms.length;
      forms.splice(0, skip);
      forms.length ? forms.length = limit : '';
      return { forms, count }
   }

   static async getHumansList({ limit, page, filter, sort, descending }: AssistanceTypes.GetHumansListQuery) {
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
      const humansList = await AssistanceModel.find(query,
         { fio: { $concat: ['$surname', ' ', '$name', ' ', '$patronymic'] } })
         .sort({ surname: descending ? -1 : 1, name: descending ? -1 : 1, patronymic: descending ? -1 : 1 })
         .collation({ numericOrdering: true, caseLevel: false, locale: 'ru' })
         .lean();

      const count = humansList.length;
      humansList.splice(0, skip);
      humansList.length > limit && (humansList.length = limit);

      return { humansList, count };
   }

   static async deleteFormById(id: string) {
      const deleteResult = await AssistanceModel.deleteOne({ _id: id }).lean();
      return deleteResult;
   }

   static async modifyForm(id: string, form: AssistanceForm) {
      const updateResult = await AssistanceModel.updateOne({ _id: id }, { $set: form }, { runValidators: true })
         .lean()
      return updateResult;
   }

   static async getFormById(id: string) {
      const form = await AssistanceModel.findById(id, { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 }).lean();
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

   static async getStats(filters: AssistanceTypes.GetStatsQuery) {
      const date = new Date(filters.timestamp);
      const list = new Map();

      if (filters.by === 'day') {
         const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
         const forms = await AssistanceModel.find({
            createdAt: {
               $gte: new Date(date.getFullYear(), date.getMonth(), 1),
               $lte: new Date(date.getFullYear(), date.getMonth(), lastDay)
            }
         }, { createdAt: 1 });
         for (let i = 1; i <= lastDay; i++) {
            list.set(i, 0);
         }

         for (const form of forms) {
            const formDate = new Date(form.createdAt);
            list.set(formDate.getDate(), list.get(formDate.getDate())! + 1);
         }
      } else if (filters.by === 'month') {
         const forms = await AssistanceModel.find({
            createdAt: {
               $gte: new Date(date.getFullYear(), 0),
               $lte: new Date(date.getFullYear(), 11)
            }
         }, { createdAt: 1 });

         for (let i = 0; i <= 11; i++) {
            list.set(i, 0);
         }

         for (const form of forms) {
            const formDate = new Date(form.createdAt);
               list.set(formDate.getMonth(), list.get(formDate.getMonth())! + 1);
         }
      }

      return Object.fromEntries(list.entries());
   }
}