import type { Stream } from 'stream'
import { createWriteStream } from 'fs'
import { unlink } from 'fs/promises'
import { resolve } from 'path'


export default class Util {
   static async createAsyncWriteStream(data: Buffer, folder: string, fileName: string): Promise<void> {
      return new Promise((res, rej) => {
         createWriteStream(resolve(__dirname, folder, fileName))
            .on('error', rej)
            .on('finish', res)
            .write(data);
      });
   }

   static async pipeStreamAsync(stream: Stream, folder: string, fileName: string): Promise<string> {
      return new Promise((res, rej) => {
         stream.pipe(createWriteStream(resolve(__dirname, folder, fileName)))
            .on('error', rej)
            .on('finish', () => res(resolve(__dirname, folder, fileName)));
      });
   }

   static removeFile(path: string) {
      return unlink(resolve(__dirname, path));
   }
}