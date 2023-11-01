import type { IComment } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const CommentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    mediaId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reactions: {
      type: Schema.Types.Map,
      of: [String],
      default: new Map(Object.entries({ '👍': [], '👎': [], '😊': [], '😂': [], '❤️': [] })),
    },
  },
  { timestamps: true }
);

export default model<IComment>('Comment', CommentSchema);
