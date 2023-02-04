import { createWriteStream } from 'fs'
import path from 'path'


export default class Util {
   static async createAsyncWriteStream(data: Buffer, path_to_file: string): Promise<void> {
      return new Promise((resolve, reject) => {
         const stream = createWriteStream(path.resolve(__dirname, path_to_file));
         stream.on('error', reject);
         stream.on('finish', resolve);
         stream.write(data);
         stream.end();
      });
   }
}