import type { SendFormResponse } from '@/types/bot-types'
import type { AssistanceForm } from '@/types/interfaces'
import axios, { type AxiosResponse } from 'axios'


export default class ApiCalls {
   static async saveForm(form: AssistanceForm): Promise<AxiosResponse<SendFormResponse>> {
      const response = await axios.post<SendFormResponse>(`${process.env.SERVER_URL}/api/assistance`, { form });
      return response;
   }
}