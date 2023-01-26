import { createWriteStream } from 'fs'
import path from 'path'


export default class Util {
   static async createAsyncWriteStream(data: Buffer, filename: string): Promise<void> {
      return new Promise((resolve, reject) => {
         const stream = createWriteStream(path.resolve(__dirname, '../../images/avatars/', filename));
         stream.on('error', reject);
         stream.on('finish', resolve);
         stream.write(data);
         stream.end();
      });
   }
}