import type { MultipartFile } from '@fastify/multipart'
import { google } from 'googleapis'
import { ToolsModel } from '@/models/mongo'
import { ApiError } from '@/exeptions'
import { v4 } from 'uuid'


export default class ImageService {
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
      const driveService = google.drive({ version: 'v3', auth: client as any });
      const list = await driveService.files.list({
         q: `'${googleApi.settings.folderId}' in parents and trashed=false 
      and (mimeType=\'image/png\' or mimeType=\'image/jpeg\')`,
         pageSize: 20,
         pageToken,
      });
      const nextPageToken = list?.data?.nextPageToken || undefined;
      const images = list.data.files?.map(item => {
         return { link: `https://drive.google.com/uc?export=view&id=${item.id}`, fileId: item.id }
      });

      return { images: images || [], pageToken: nextPageToken };
   }

   static async uploadImages(parts: AsyncIterableIterator<MultipartFile>) {
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
      const driveService = google.drive({ version: 'v3', auth: client as any });
      const images: { link: string, fileId: string }[] = [];

      for await (const part of parts) {
         if (!part) {
            throw ApiError.BadRequest(400, 'File required');
         }
         const ext = part.filename.split('.').at(-1);
         const fileName = `${v4()}.${ext}`;
         const response = await driveService.files.create({
            requestBody: { name: fileName, mimeType: part.mimetype, parents: [googleApi.settings.folderId] },
            media: { mimeType: part.mimetype, body: part.file },
         });
         images.push({
            link: `https://drive.google.com/uc?export=view&id=${response.data.id}`,
            fileId: response.data.id || ''
         });
      }

      return images;
   }

   static async deleteImages(ids: string[]) {
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
      const driveService = google.drive({ version: 'v3', auth: client as any });
      const removed = [];

      for (const id of ids) {
         await driveService.files.delete({ fileId: id });
         removed.push(id);
      }

      return removed;
   }
}