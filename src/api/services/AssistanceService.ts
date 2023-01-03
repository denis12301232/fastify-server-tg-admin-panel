import type { AssistanceTypes } from '@/types/queries'
import type { AssistanceForm, AnyObject } from '@/types/interfaces'
import type { Types, FilterQuery } from 'mongoose'
import AssistanceModel from '@/models/mongo/AssistanceModel'
import ApiError from '@/exeptions/ApiError'
import ToolsModel from '@/models/mongo/ToolsModel'
import Constants from '@/util/Constants'
import { GoogleSpreadsheet } from 'google-spreadsheet'


export class AssistanceService {
   static async saveForm(form: AssistanceForm) {
      const saved = await AssistanceModel.create(form)
         .catch(e => { throw ApiError.BadRequest(e.message, e.errors) });
      return saved;
   }

   static async getForms(fio: AssistanceTypes.GetFormsQuery) {
      const { name, surname, patronymic } = fio;
      const form = await AssistanceModel.find({ name, surname, patronymic }, { __v: 0 }).lean();

      if (!form.length) {
         throw ApiError.BadRequest(400, `Увы, ничего не найдено по запросу ${surname} ${name} ${patronymic}`);
      }

      return form.reduce((box: Array<{ _id: Types.ObjectId, form: AssistanceForm }>, item) => {
         return [...box, {
            _id: item._id,
            form: Object.fromEntries(Object.entries(item).filter(([key]) => key !== '_id'))
         }] as Array<{ _id: Types.ObjectId, form: AssistanceForm }>
      }, []);
   }

   static async getHumansList(limit: number, page: number) {
      const skip = (page - 1) * limit;
      const humansList = await AssistanceModel.find({}, { name: 1, surname: 1, patronymic: 1, _id: 1 })
         .skip(skip)
         .limit(limit)
         .lean();

      const count = await AssistanceModel.count();
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
      const api = await ToolsModel.find().limit(1);

      if (!api.length) {
         return { message: 'Интеграция не настроена!', link: `` };
      }
      const conditions: FilterQuery<AssistanceForm>[] = [];

      if (filters.district) {
         conditions.push({ district: filters.district });
      }
      if (filters.birth?.from && filters.birth?.to) {
         conditions.push({
            $expr: {
               $function: {
                  body: "function (birth, filters) { return +birth.split('.')[0] >= +filters.birth.from && +birth.split('.')[0] <= +filters.birth.to }",
                  args: ["$birth", filters],
                  lang: "js"
               }
            },
         });
      }

      const finalCondition = conditions.length ? { $and: conditions } : {};
      const forms = await AssistanceModel.find(finalCondition).lean();

      if (!forms.length) throw ApiError.BadRequest(400, 'Увы, ничего не найдено по запросу!');

      const doc = new GoogleSpreadsheet(api[0].api.google.service.sheetId);
      await doc.useServiceAccountAuth({
         client_email: api[0].api.google.service.user,
         private_key: api[0].api.google.service.privateKey,
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      await sheet.clear();
      await sheet.loadCells('A1:X1');
      const allFields: Array<[any, { display: string }]> = Object.entries(Constants.assistance);
      allFields.forEach(async ([key, value], index) => {
         const cell = sheet.getCell(0, index);
         cell.value = value.display;
      });
      await sheet.saveUpdatedCells();

      for (const item of forms) {
         const sheetObj = allFields.reduce((obj, [key, value]: [keyof AssistanceForm, { display: string }]) => {
            if (Array.isArray(item[key])) {
               obj[value.display] = (<string[]>item[key])!.join(',');
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
         message: 'Успешно сформировано!',
         link: `https://docs.google.com/spreadsheets/d/${api[0].api.google.service.sheetId}`
      };
   }
}