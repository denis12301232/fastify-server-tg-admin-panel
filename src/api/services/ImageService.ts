import type { MultipartFile } from '@fastify/multipart';
import { ImageTypes } from '@/types/queries.js';
import { google } from 'googleapis';
import Models from '@/models/mongo/index.js';
import ApiError from '@/exceptions/ApiError.js';
import { v4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import { Readable } from 'stream';

export default class ImageService {
  static async getImages({ limit, descending, sort, skip }: ImageTypes.GetImagesQuery) {
    const [images, count] = await Promise.all([
      Models.Media.find({}, { __v: 0 })
        .sort({ [sort]: descending ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Models.Media.count(),
    ]);

    return { images, count };
  }

  static async uploadImages(parts: AsyncIterableIterator<MultipartFile>) {
    const googleApi = await Models.Tools.findOne({ api: 'google' }).lean();

    if (!googleApi) {
      throw ApiError.BadRequest(400, 'Integration not set');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleApi.settings.serviceUser as string,
        private_key: googleApi.settings.servicePrivateKey as string,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const driveService = google.drive({ version: 'v3', auth });
    const images: { link: string; fileId: string }[] = [];

    for await (const part of parts) {
      const buffer = await part.toBuffer();

      if (!buffer) {
        throw ApiError.BadRequest(400, 'File required');
      }

      const validateResult = await fileTypeFromBuffer(buffer);

      if (!validateResult?.mime.includes('image/')) {
        throw ApiError.BadRequest(400, 'Wrong file type');
      }

      const ext = part.filename.split('.').at(-1);
      const fileName = `${v4()}.${ext}`;
      const response = await driveService.files.create({
        requestBody: { name: fileName, mimeType: part.mimetype, parents: [googleApi.settings.folderId as string] },
        media: { mimeType: part.mimetype, body: Readable.from(buffer) },
      });
      images.push({
        link: `https://drive.google.com/uc?export=view&id=${response.data.id}`,
        fileId: response.data.id || '',
      });
    }

    const result = await Promise.all(images.map((img) => Models.Media.create({ link: img.link, fileId: img.fileId })));
    return result;
  }

  static async deleteImages(ids: string[]) {
    const googleApi = await Models.Tools.findOne({ api: 'google' }).lean();

    if (!googleApi) {
      throw ApiError.BadRequest(400, 'Integration not set');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleApi.settings.serviceUser as string,
        private_key: googleApi.settings.servicePrivateKey as string,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const driveService = google.drive({ version: 'v3', auth });
    const removed: string[] = [];

    for (const id of ids) {
      await Promise.all([driveService.files.delete({ fileId: id }), Models.Media.deleteOne({ fileId: id })]);
      removed.push(id);
    }

    return removed;
  }

  static async updateDescription(id: string, description: string) {
    const result = await Models.Media.updateOne({ _id: id }, { description }).lean();
    return result;
  }
}
