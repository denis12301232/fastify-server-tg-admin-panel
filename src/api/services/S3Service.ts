import { S3Client, PutObjectCommand, DeleteObjectsCommand, type ObjectIdentifier } from '@aws-sdk/client-s3';
import { join } from 'path';

export default class S3Service {
  public static readonly URL = process.env.AWS_BUCKET_URL;
  public static readonly IMAGE_FOLDER = 'images';
  private static readonly bucketName = process.env.AWS_BUCKET_NAME;
  private static readonly region = process.env.AWS_BUCKET_REGION;
  private static readonly accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  private static readonly secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  private static readonly S3 = new S3Client({
    region: this.region,
    credentials: {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    },
  });

  public static uploadFile(stream: ReadableStream | Buffer, path: string, filename: string) {
    const command = new PutObjectCommand({ Bucket: this.bucketName, Body: stream, Key: join(path, filename) });
    return this.S3.send(command);
  }

  public static deleteFiles(Objects: ObjectIdentifier[]) {
    const command = new DeleteObjectsCommand({ Bucket: this.bucketName, Delete: { Objects } });
    return this.S3.send(command);
  }
}
