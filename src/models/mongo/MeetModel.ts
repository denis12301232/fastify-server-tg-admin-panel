import type { IMeet } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const MeetSchema = new Schema<IMeet>(
  {
    title: {
      type: String,
      required: true,
    },
    invited: {
      type: [],
      default: [],
    },
    members: {
      type: [],
      required: true,
    },
    roles: {
      type: Map,
      of: [],
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IMeet>('Meet', MeetSchema);
