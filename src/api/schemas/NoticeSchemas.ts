import type { NoticeTypes } from '@/types/index.js';
import Joi from 'joi';

export default class AssistanceSchemas {
  static readonly store = {
    body: Joi.object<NoticeTypes.Store['Body']>()
      .keys({
        text: Joi.string().required(),
        title: Joi.string().required(),
        show: Joi.boolean(),
      })
      .required(),
  };

  static readonly update = {
    params: Joi.object<NoticeTypes.Update['Params']>().keys({ id: Joi.string().required() }).required(),
    body: Joi.object<NoticeTypes.Update['Body']>().keys({ show: Joi.boolean().required() }).required(),
  };

  static readonly destroy = {
    params: Joi.object<NoticeTypes.Destroy['Params']>().keys({ id: Joi.string().required() }),
  };
}
