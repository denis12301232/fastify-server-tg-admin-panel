import type { IMessage } from '@/types'
import { Schema, model } from 'mongoose'


const MessageSchema = new Schema<IMessage>({
   chat_id: {
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
   attachments: [{
      type: Schema.Types.ObjectId,
      ref: 'Attachment',
      default: [],
   }],
   read: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
   }]
}, { timestamps: true });

export default model<IMessage>('Message', MessageSchema);