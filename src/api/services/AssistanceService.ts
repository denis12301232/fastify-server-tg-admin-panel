import type { AssistanceTypes, Entries, IAssistance } from '@/types/index.js';
import type { FilterQuery } from 'mongoose';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Models from '@/models/mongo/index.js';
import ApiError from '@/exceptions/ApiError.js';
import { locales } from '@/i18/index.js';

export default class AssistanceService {
  static async saveForm(form: IAssistance) {
    const saved = await Models.Assistance.create(form);
    return saved;
  }

  static async getForms(nameOrSurname: string, limit: number, page: number) {
    const skip = (page - 1) * limit;
    const forms = await Models.Assistance.find(
      {
        $or: [
          { name: { $regex: nameOrSurname, $options: 'i' } },
          { surname: { $regex: nameOrSurname, $options: 'i' } },
        ],
      },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();
    if (!forms.length) {
      throw ApiError.BadRequest(400, `Nothing was found at query ${nameOrSurname}`);
    }
    const count = forms.length;
    forms.splice(0, skip);
    forms.length ? (forms.length = limit) : '';
    return { forms, count };
  }

  static async getHumansList({ limit, page, filter, sort, descending }: AssistanceTypes.GetHumansListQuery) {
    const query = filter
      ? {
          $or: [
            { surname: { $regex: filter, $options: 'i' } },
            { name: { $regex: filter, $options: 'i' } },
            { patronymic: { $regex: filter, $options: 'i' } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;
    const humansList = await Models.Assistance.find(query, {
      fio: { $concat: ['$surname', ' ', '$name', ' ', '$patronymic'] },
    })
      .sort({ surname: descending ? -1 : 1, name: descending ? -1 : 1, patronymic: descending ? -1 : 1 })
      .collation({ numericOrdering: true, caseLevel: false, locale: 'ru' })
      .lean();

    const count = humansList.length;
    humansList.splice(0, skip);
    humansList.length > limit && (humansList.length = limit);

    return { humansList, count };
  }

  static async deleteForms(ids: string[]) {
    const deleteResult = await Models.Assistance.deleteMany({ _id: { $in: ids } }).lean();
    return deleteResult;
  }

  static async modifyForm(id: string, form: IAssistance) {
    const updateResult = await Models.Assistance.updateOne({ _id: id }, { $set: form }, { runValidators: true }).lean();
    return updateResult;
  }

  static async getFormById(id: string) {
    const form = await Models.Assistance.findById(id, { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 }).lean();
    return form;
  }

  static async saveFormsToSheet(filters: AssistanceTypes.SaveFormsToSheetsBody) {
    const google = await Models.Tools.findOne({ api: 'google' }).lean();
    const LINK = 'https://docs.google.com/spreadsheets/d/';

    if (!google) {
      throw ApiError.BadRequest(400, 'Integration not set');
    }

    const conditions: { [name: string]: FilterQuery<IAssistance> } = {
      disrtict: filters.district ? { district: filters.district } : {},
      street: filters.street ? { street: filters.street } : {},
      birth:
        filters.birth?.from && filters.birth?.to
          ? {
              $expr: {
                $function: {
                  body: `${function (birth: string, filters: AssistanceTypes.SaveFormsToSheetsBody) {
                    return +birth.split('/')[0] >= +filters.birth.from && +birth.split('/')[0] <= +filters.birth.to;
                  }}`,
                  args: ['$birth', filters],
                  lang: 'js',
                },
              },
            }
          : {},
    };
    const forms = await Models.Assistance.find({ $and: Object.values(conditions) }).lean();

    if (!forms.length) {
      throw ApiError.NotFound();
    }

    const doc = new GoogleSpreadsheet(google.settings.sheetId as string);

    await doc.useServiceAccountAuth({
      client_email: google.settings.serviceUser as string,
      private_key: google.settings.servicePrivateKey as string,
    });
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.clear();
    await sheet.loadCells('A1:Y1');
    // Head
    const allFields = Object.entries(locales[filters.locale].assistance.fields) as Entries<
      (typeof locales)['en']['assistance']['fields']
    >;
    allFields.forEach(([key, value], index) => {
      const cell = sheet.getCell(0, index);
      cell.value = value;
    });
    await sheet.saveUpdatedCells();
    // Values
    for (const item of forms) {
      const sheetObj = allFields.reduce((obj, [key, value]) => {
        if (key === 'district') {
          obj[value] = locales[filters.locale].assistance.districts[item[key]];
        } else if (key === 'street') {
          obj[value] = locales[filters.locale].assistance.streets[item.district][item[key]];
        } else if (Array.isArray(item[key])) {
          obj[value] = (item[key] as string[])?.join(',');
        } else if (typeof item[key] === 'boolean') {
          obj[value] = item[key]
            ? locales[filters.locale].assistance.checkboxes.yesNo.yes
            : locales[filters.locale].assistance.checkboxes.yesNo.no;
        } else {
          obj[value] = item[key];
        }
        return obj;
      }, {});
      await sheet.addRow(sheetObj);
    }

    return {
      message: 'Successfully formed',
      link: new URL(google.settings.sheetId as string, LINK).toString(),
    };
  }

  static async getStats(filters: AssistanceTypes.GetStatsQuery) {
    const date = new Date(filters.timestamp);
    const list = new Map();

    if (filters.by === 'month') {
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const forms = await Models.Assistance.find(
        {
          createdAt: {
            $gte: new Date(date.getFullYear(), date.getMonth(), 1),
            $lte: new Date(date.getFullYear(), date.getMonth(), lastDay),
          },
        },
        { createdAt: 1 }
      );
      for (let i = 1; i <= lastDay; i++) {
        list.set(i, 0);
      }

      for (const form of forms) {
        const formDate = new Date(form.createdAt);
        list.set(formDate.getDate(), list.get(formDate.getDate()) + 1);
      }
    } else if (filters.by === 'year') {
      const forms = await Models.Assistance.find(
        {
          createdAt: {
            $gte: new Date(date.getFullYear(), 0),
            $lte: new Date(date.getFullYear(), 11),
          },
        },
        { createdAt: 1 }
      );

      for (let i = 0; i <= 11; i++) {
        list.set(i, 0);
      }

      for (const form of forms) {
        const formDate = new Date(form.createdAt);
        list.set(formDate.getMonth(), list.get(formDate.getMonth()) + 1);
      }
    }

    return Object.fromEntries(list.entries());
  }
}
