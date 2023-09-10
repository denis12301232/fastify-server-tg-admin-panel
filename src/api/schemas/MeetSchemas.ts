import type { MeetTypes } from '@/types/index.js';
import Joi from 'joi';

export default class MeetSchemas {
  static readonly show = {
    params: Joi.object<MeetTypes.Show['Params']>({ id: Joi.string().required() }).required(),
  };
}
