import type { FastifyPluginCallback } from 'fastify';
import { access, mkdir } from 'fs/promises';
import { constants } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const staticFoldersCreatePlugin: FastifyPluginCallback<string[]> = async (app, options, done) => {
  const dirname = fileURLToPath(new URL('.', import.meta.url));
  console.log(dirname);
  
  await Promise.allSettled(
    options.map((folder) => {
      return access(resolve(dirname, folder), constants.R_OK | constants.W_OK).catch(
        async () => await mkdir(resolve(dirname, folder), { recursive: true })
      );
    })
  );
  done();
};

export default staticFoldersCreatePlugin;
