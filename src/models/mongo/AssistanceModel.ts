import type { IAssistance } from '@/types/index.js';
import { Schema, model } from 'mongoose';

const AssistanceSchema = new Schema<IAssistance>(
  {
    surname: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    patronymic: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birth: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    house: {
      type: String,
      required: true,
    },
    flat: {
      type: Number,
      required: true,
    },
    people_num: {
      type: Number,
      required: true,
    },
    people_fio: {
      type: [String],
      default: [],
    },
    invalids: {
      type: Boolean,
      default: false,
    },
    kids: {
      type: Boolean,
      default: false,
    },
    kids_age: {
      type: [String],
      default: [],
    },
    food: {
      type: Boolean,
      default: false,
    },
    water: {
      type: Boolean,
      default: false,
    },
    medicines: {
      type: Boolean,
      default: false,
    },
    medicines_info: {
      type: String,
      default: '-',
    },
    hygiene: {
      type: Boolean,
      default: false,
    },
    hygiene_info: {
      type: String,
      default: '-',
    },
    pampers: {
      type: Boolean,
      default: false,
    },
    pampers_info: {
      type: String,
      default: '-',
    },
    diet: {
      type: String,
      default: '-',
    },
    pers_data_agreement: {
      type: Boolean,
      required: true,
    },
    photo_agreement: {
      type: Boolean,
      required: true,
    },
    sector: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default model<IAssistance>('Assistance', AssistanceSchema);
