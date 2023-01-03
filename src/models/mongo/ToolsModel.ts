import type { ITools } from '@/types/interfaces'
import { Schema, model } from 'mongoose'


const ToolsSchema = new Schema<ITools>({
   api: {
      google: {
         user: {
            type: String,
            default: '',
         },
         app_password: {
            type: String,
            default: '',
         },
         service: {
            user: {
               type: String,
               default: '',
            },
            privateKey: {
               type: String,
               default: '',
            },
            sheetId: {
               type: String,
               default: '',
            },
            folderId: {
               type: String,
               default: '',
            }
         }
      }
   },
});

export default model<ITools>('Tools', ToolsSchema);