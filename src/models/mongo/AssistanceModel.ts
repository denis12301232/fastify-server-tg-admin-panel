import type { AssistanceForm } from '@/types/interfaces'
import { Schema, model } from 'mongoose'
import Validate from '@/util/Validate'


const AssistanceSchema = new Schema<AssistanceForm>({
   surname: {
      type: String,
      required: true,
      maxlength: [30, 'to many symbols'],
   },
   name: {
      type: String,
      required: true,
      maxlength: [30, 'to many symbols'],
   },
   patronymic: {
      type: String,
      required: true,
      maxlength: [30, 'to many symbols'],
   },
   phone: {
      type: String,
      required: true,
      validate: {
         validator: Validate.isPhone,
         message: (props) => `${props.value} is not a valid phone`,
      }
   },
   birth: {
      type: String,
      required: true,
      validate: {
         validator: Validate.isYYYYMMDD,
         message: (props) => `${props.value} is not a valid birth`,
      }
   },
   district: {
      type: String,
      required: true,
      validate: {
         validator: Validate.isValidDistrict,
         message: (props) => `${props.value} is not a valid district`,
      }
   },
   street: {
      type: String,
      required: true,
      maxlength: [30, 'to many symbols'],
   },
   house: {
      type: String,
      required: true,
      maxlength: [30, 'to many symbols'],
   },
   flat: {
      type: String,
      required: true,
      maxlength: [30, 'to many symbols'],
   },
   people_num: {
      type: Number,
      required: true,
      maxlength: [2, 'to many symbols'],
      max: [10, 'to large number'],
   },
   people_fio: {
      type: [String],
      default: ['-'],
      validate: {
         validator: Array.isArray,
         message: (props) => `${props.value} is not a valid type`,
      }
   },
   invalids: {
      type: String,
      default: 'Нет',
      maxlength: [30, 'to many symbols'],
   },
   children: {
      type: String,
      default: 'Нет',
      maxlength: [30, 'to many symbols'],
   },
   children_age: {
      type: [String],
      default: ['-'],
      validate: {
         validator: Array.isArray,
         message: (props) => `${props.value} is not a valid type`,
      }
   },
   food: {
      type: String,
      default: 'Нет',
      maxlength: [100, 'to many symbols'],
   },
   drugs: {
      type: String,
      default: 'Нет',
      maxlength: [100, 'to many symbols'],
   },
   water: {
      type: String,
      default: 'Нет',
      maxlength: [30, 'to many symbols'],
   },
   products_detail: {
      type: String,
      default: '-',
      maxlength: [30, 'to many symbols'],
   },
   gigien: {
      type: String,
      default: 'Нет',
      maxlength: [100, 'to many symbols'],
   },
   gigien_num: {
      type: String,
      default: '-',
      maxlength: [100, 'to many symbols'],
   },
   pampers: {
      type: String,
      default: '-',
      maxlength: [100, 'to many symbols'],
   },
   diet: {
      type: String,
      default: '-',
      maxlength: [100, 'to many symbols'],
   },
   pers_data_agreement: {
      type: Boolean,
      required: true,
      validate: {
         validator: (value: boolean) => value === true,
         message: () => `Agreement required`,
      }
   },
   photo_agreement: {
      type: Boolean,
      required: true,
      validate: {
         validator: (value: boolean) => value === true,
         message: () => `Agreement required`,
      }
   }
});

export default model<AssistanceForm>('Assistance', AssistanceSchema);