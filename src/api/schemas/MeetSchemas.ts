import type { MeetTypes } from '@/types/index.js';
import Joi from 'joi';

export default class MeetSchemas {
  static readonly getMeetInfo = {
    querystring: Joi.object<MeetTypes.GetInfo['Querystring']>({
      meetId: Joi.string().required(),
    }).required(),
  };
}
