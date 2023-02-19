import type { ITask } from '@/types/interfaces'
import { Schema, model } from 'mongoose'


const TaskSchema = new Schema<ITask>({
   title: {
      type: String,
      required: true
   },
   tags: {
      type: [String],
      required: true
   },
   description: {
      type: String,
      required: true
   },
   date: {
      type: String,
      required: true
   },
   status: {
      type: String,
      required: true
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
}, { timestamps: true });

export default model<ITask>('Task', TaskSchema);