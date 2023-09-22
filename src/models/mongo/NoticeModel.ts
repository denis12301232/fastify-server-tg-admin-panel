import type { INotice } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const NoticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<INotice>('Notice', NoticeSchema);
