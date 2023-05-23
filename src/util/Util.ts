import type { Stream } from 'stream';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { unlink } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

export default class Util {
  static async createAsyncWriteStream(data: Buffer, folder: string, fileName: string): Promise<string> {
    const dirname = fileURLToPath(new URL('.', import.meta.url));
    return new Promise((res, rej) => {
      Readable.from(data)
        .pipe(createWriteStream(resolve(dirname, folder, fileName)))
        .on('error', rej)
        .on('finish', () => res(resolve(dirname, folder, fileName)));
    });
  }

  static async pipeStreamAsync(stream: Stream, folder: string, fileName: string): Promise<string> {
    const dirname = fileURLToPath(new URL('.', import.meta.url));
    return new Promise((res, rej) => {
      stream
        .pipe(createWriteStream(resolve(dirname, folder, fileName)))
        .on('error', rej)
        .on('finish', () => res(resolve(dirname, folder, fileName)));
    });
  }

  static removeFile(path: string) {
    const dirname = fileURLToPath(new URL('.', import.meta.url));
    return unlink(resolve(dirname, path));
  }
}
