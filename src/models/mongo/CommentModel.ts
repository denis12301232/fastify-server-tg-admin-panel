import type { IComment } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const CommentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    media: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reactions: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

export default model<IComment>('Comment', CommentSchema);
