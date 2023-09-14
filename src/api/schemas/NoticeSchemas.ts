import type { NoticeTypes } from '@/types/index.js';
import Joi from 'joi';

export default class AssistanceSchemas {
  static readonly store = {
    body: Joi.object<NoticeTypes.Store['Body']>()
      .keys({
        id: Joi.string().required(),
        text: Joi.string().required(),
        time: Joi.date().required(),
        title: Joi.string().required(),
        show: Joi.boolean().required(),
      })
      .required(),
  };

  static readonly destroy = {
    params: Joi.object<NoticeTypes.Destroy['Params']>().keys({ id: Joi.string().required() }),
  };
}
