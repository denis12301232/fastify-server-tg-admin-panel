import type { IMedia } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const MediaSchema = new Schema<IMedia>(
  {
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    fileId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IMedia>('Media', MediaSchema);
