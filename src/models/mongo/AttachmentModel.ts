import { Schema, model } from 'mongoose'


const AttachmentSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   ext: {
      type: String,
      required: true,
   },
   mime: {
      type: String,
      required: true
   },
   type: {
      type: String,
      required: true,
      enum: ['audio', 'image']
   }
}, { timestamps: true });

export default model('Attachment', AttachmentSchema);