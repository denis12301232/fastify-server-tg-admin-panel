import type { MeetTypes } from '@/types/index.js';
import Joi from 'joi';

export default class MeetSchemas {
  static readonly show = {
    params: Joi.object<MeetTypes.Show['Params']>({ id: Joi.string().required() }).required(),
  };

  static readonly create = {
    body: Joi.object<MeetTypes.Create['Body']>()
      .keys({
        title: Joi.string().required(),
        invited: Joi.array().min(0).items(Joi.string()).required(),
      })
      .required(),
  };

  static readonly update = {
    params: Joi.object<MeetTypes.Update['Params']>().keys({ id: Joi.string().required() }).required(),
    body: Joi.object<MeetTypes.Update['Body']>()
      .keys({
        title: Joi.string().required(),
        invited: Joi.array().min(0).items(Joi.string()).required(),
      })
      .required(),
  };

  static readonly join = {
    params: Joi.object<MeetTypes.Join['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly leave = {
    params: Joi.object<MeetTypes.Leave['Params']>().keys({ id: Joi.string().required() }).required(),
  };

  static readonly invite = {
    params: Joi.object<MeetTypes.Invite['Params']>().keys({ id: Joi.string().required() }).required(),
    body: Joi.array<MeetTypes.Invite['Body']>().items(Joi.string()).min(1).required(),
  };
}
