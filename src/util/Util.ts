import { createWriteStream, } from 'fs'
import { resolve } from 'path'


export default class Util {
   static async createAsyncWriteStream(data: Buffer, folder: string, fileName: string): Promise<void> {
      return new Promise((res, rej) => {
         const stream = createWriteStream(resolve(__dirname, folder, fileName));
         stream.on('error', rej);
         stream.on('finish', res);
         stream.write(data);
         stream.end();
      });
   }
}