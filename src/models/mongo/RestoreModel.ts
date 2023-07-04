import { Schema, model } from 'mongoose';

const RestoreSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  restoreLink: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export default model('Restore', RestoreSchema);
