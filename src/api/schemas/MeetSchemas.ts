import type { MeetTypes } from '@/types'
import Joi from 'joi'


export class MeetSchemas {
   static readonly getMeetInfoQuery = Joi.object<MeetTypes.GetInfoQuery>({
      meetId: Joi.string().required()
   });
}