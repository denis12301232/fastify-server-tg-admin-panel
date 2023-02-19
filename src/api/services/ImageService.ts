import { google } from 'googleapis'
import { ToolsModel } from '@/models/mongo'
import ApiError from '@/exeptions/ApiError'


export class ImageService {
   static async getImages(pageToken: string) {
      const googleApi = await ToolsModel.findOne({ api: 'google' }).lean();
         
      if (!googleApi) {
         throw ApiError.BadRequest(400, 'Integration not set');
      }

      const auth = new google.auth.GoogleAuth({
         credentials: {
            client_email: googleApi.settings.serviceUser,
            private_key: googleApi.settings.servicePrivateKey,
         },
         scopes: ['https://www.googleapis.com/auth/drive']
      });
      const client = await auth.getClient();
      const driveService = google.drive({ version: 'v3', auth: client });
      const list = await driveService.files.list({
         q: `'${googleApi.settings.folderId}' in parents and trashed=false 
      and (mimeType=\'image/png\' or mimeType=\'image/jpeg\')`,
         pageSize: 20,
         pageToken,
      });
      const nextPageToken = list?.data?.nextPageToken || undefined;
      const images = list.data.files?.map(item => {
         return { link: `https://drive.google.com/uc?export=view&id=${item.id}` }
      });

      return { images: images || [], pageToken: nextPageToken };
   }
}