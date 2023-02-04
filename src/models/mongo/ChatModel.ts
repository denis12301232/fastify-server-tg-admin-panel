import type { IChat } from '@/types/interfaces'
import { Schema, model } from 'mongoose'


const ChatSchema = new Schema<IChat>({
   users: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   }],
   messages: [{
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: [],
   }],
   type: {
      type: String,
      default: 'dialog',
      enum: ['dialog', 'group'],
   },
   deleted: {
      type: [String],
   },
   group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
   }
}, { timestamps: true });

export default model<IChat>('Chat', ChatSchema);