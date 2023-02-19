import type { IGroup } from '@/types/interfaces'
import { Schema, model } from 'mongoose'


const GroupSchema = new Schema<IGroup>({
   title: {
      type: String,
      required: true,
   },
   avatar: {
      type: String,
      default: ''
   },
   roles: {
      type: Map,
      of: [String],
      default: new Map,
   }
});

export default model<IGroup>('Group', GroupSchema);