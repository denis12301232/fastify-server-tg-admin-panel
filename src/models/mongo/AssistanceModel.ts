import type { AssistanceForm } from '@/types/interfaces'
import { Schema, model } from 'mongoose'


const AssistanceSchema = new Schema<AssistanceForm>({
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
      type: String,
      required: true,
   },
   people_num: {
      type: Number,
      required: true,
   },
   people_fio: {
      type: [String],
      default: ['-'],
   },
   invalids: {
      type: String,
      default: 'Нет',
   },
   kids: {
      type: String,
      default: 'Нет',
   },
   kids_age: {
      type: [String],
      default: ['-'],
   },
   food: {
      type: String,
      default: 'Нет',
   },
   water: {
      type: String,
      default: 'Нет',
   },
   medicines: {
      type: String,
      default: 'Нет',
   },
   medicines_info: {
      type: String,
      default: '-',
   },
   hygiene: {
      type: String,
      default: 'Нет',
   },
   hygiene_info: {
      type: String,
      default: '-',
   },
   pampers: {
      type: String,
      default: 'Нет',
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
   }
});

export default model<AssistanceForm>('Assistance', AssistanceSchema);