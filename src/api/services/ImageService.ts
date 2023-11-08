import type { MultipartFile } from '@fastify/multipart';
import type { ImageTypes, IMedia, IUser } from '@/types/index.js';
import Models from '@/models/mongo/index.js';
import ApiError from '@/exceptions/ApiError.js';
import { v4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import { Readable } from 'stream';
import { S3Service, GoogleService } from '@/api/services/index.js';
import { join } from 'path';

export default class ImageService {
  static async getImages({ limit, descending, sort, skip }: ImageTypes.GetImages['Querystring']) {
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

  static async uploadToS3(parts: AsyncIterableIterator<MultipartFile>) {
    const images: Omit<IMedia, '_id' | 'comments'>[] = [];

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
      await S3Service.uploadFile(buffer, S3Service.IMAGE_FOLDER, fileName);

      images.push({
        fileName: fileName.split('.').at(0) || '',
        mimeType: part.mimetype,
        ext: ext || '',
      });
    }

    const result = await Promise.all(images.map((img) => Models.Media.create(img)));
    return result;
  }

  static async deleteFromS3(ids: string[]) {
    const images = await Models.Media.find({ _id: { $in: ids } }).lean();
    const objects = images.map((img) => ({ Key: join(S3Service.IMAGE_FOLDER, `${img.fileName}.${img.ext}`) }));

    await Promise.all([S3Service.deleteFiles(objects), Models.Media.deleteMany({ _id: { $in: ids } })]);

    return images.map((img) => img._id);
  }

  static async uploadImages(parts: AsyncIterableIterator<MultipartFile>) {
    const googleApi = await Models.Tools.findOne({ api: 'google' }).lean();

    if (!googleApi) {
      throw ApiError.BadRequest(400, 'Integration not set');
    }

    const auth = await GoogleService.auth(['https://www.googleapis.com/auth/drive']);
    const driveService = GoogleService.drive(auth);
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
        link: GoogleService.exportUrl(String(response.data.id)),
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

    const auth = await GoogleService.auth(['https://www.googleapis.com/auth/drive']);
    const driveService = GoogleService.drive(auth);
    const removed: string[] = [];

    for (const id of ids) {
      await Promise.all([driveService.files.delete({ fileId: id }), Models.Media.deleteOne({ fileId: id })]);
      removed.push(id);
    }

    return removed;
  }

  static async updateDescription(id: string, { description }: ImageTypes.UpdateDescription['Body']) {
    const result = await Models.Media.updateOne({ _id: id }, { description }).lean();
    return result;
  }

  static async saveComment(media: string, user: string, text: string) {
    const comment = await Models.Commment.create({ media, text, user });
    await Models.Media.updateOne({ _id: media }, { $addToSet: { comments: comment.id } }).lean();

    return comment;
  }

  static async getComments(media: string, { limit, skip, sort, descending }: ImageTypes.GetComments['Querystring']) {
    const [comments, count] = await Promise.all([
      Models.Commment.find({ media })
        .sort({ [sort]: descending ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .populate<{ user: IUser }>({ path: 'user', select: 'login avatar name' })
        .lean(),
      Models.Commment.find({ media }).count(),
    ]);

    return { comments, count };
  }

  static async updateComment(id: string, { reactions }: ImageTypes.UpdateComment['Body']) {
    const updated = await Models.Commment.updateOne({ _id: id }, { reactions }).lean();
    return updated;
  }
}
