import type { ITools } from '@/types'
import { Schema, model } from 'mongoose'


const ToolsSchema = new Schema<ITools>({
   api: {
      type: String,
      required: true
   },
   settings: {
      type: {}
   }
});

export default model<ITools>('Tools', ToolsSchema);