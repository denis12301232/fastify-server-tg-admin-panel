import type { IAttachment } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const AttachmentSchema = new Schema<IAttachment>(
  {
    name: {
      type: String,
      required: true,
    },
    ext: {
      type: String,
      required: true,
    },
    mime: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['audio', 'image'],
    },
  },
  { timestamps: true }
);

export default model<IAttachment>('Attachment', AttachmentSchema);
