import type { ISubtask } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'untaken',
    },
    cause: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

export default model<ISubtask>('Subtask', SubtaskSchema);
