import type { IMessage } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const MessageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'chat',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment',
        default: [],
      },
    ],
    read: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    reactions: {
      type: Schema.Types.Map,
      of: [String],
      default: new Map(Object.entries({ '👍': [], '👎': [], '😊': [], '😂': [], '❤️': [] })),
    },
  },
  { timestamps: true }
);

export default model<IMessage>('Message', MessageSchema);
