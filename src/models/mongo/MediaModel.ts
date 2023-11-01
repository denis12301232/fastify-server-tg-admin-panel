import type { IMedia } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const MediaSchema = new Schema<IMedia>(
  {
    description: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      required: true,
      unique: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    ext: {
      type: String,
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
      default: [],
    },
  },
  { timestamps: true }
);

export default model<IMedia>('Media', MediaSchema);
