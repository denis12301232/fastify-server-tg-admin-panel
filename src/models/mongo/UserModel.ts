import type { IUser } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const UserSchema = new Schema<IUser>(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    activationLink: {
      type: String,
      maxlength: 1000,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'offline',
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
