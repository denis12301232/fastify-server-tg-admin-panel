import type { MeetTypes } from '@/types/index.js';
import Joi from 'joi';

export default class MeetSchemas {
  static readonly getMeetInfoQuery = Joi.object<MeetTypes.GetInfoQuery>({
    meetId: Joi.string().required(),
  });
}
