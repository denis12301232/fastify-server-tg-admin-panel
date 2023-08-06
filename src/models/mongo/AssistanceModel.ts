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
      type: Number,
      required: true,
    },
    street: {
      type: Number,
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
    peopleCount: {
      type: Number,
      required: true,
    },
    peopleFio: {
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
    kidsAge: {
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
    medicinesInfo: {
      type: String,
      default: '-',
    },
    hygiene: {
      type: Boolean,
      default: false,
    },
    hygieneInfo: {
      type: String,
      default: '-',
    },
    pampers: {
      type: Boolean,
      default: false,
    },
    pampersInfo: {
      type: String,
      default: '-',
    },
    extraInfo: {
      type: String,
      default: '-',
    },
    personalDataAgreement: {
      type: Boolean,
      required: true,
    },
    photoAgreement: {
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
