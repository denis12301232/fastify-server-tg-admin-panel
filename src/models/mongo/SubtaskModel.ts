import type { ISubtask } from '@/types'
import { Schema, model } from 'mongoose'


const SubtaskSchema = new Schema<ISubtask>({
   title: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   status: {
      type: String,
      default: 'Не выбрана'
   },
   cause: {
      type: String,
   }
}, { timestamps: true });

export default model<ISubtask>('Subtask', SubtaskSchema);