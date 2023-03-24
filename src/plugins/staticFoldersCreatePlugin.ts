import type { FastifyPluginCallback } from 'fastify'
import { access, mkdir } from 'fs/promises'
import { constants } from 'fs'
import { resolve } from 'path'


const staticFoldersCreatePlugin: FastifyPluginCallback<string[]> = async (app, options, done) => {
   await Promise.allSettled(options.map((folder) => {
      return access(resolve(__dirname, folder), constants.R_OK | constants.W_OK)
         .catch(async () => await mkdir(resolve(__dirname, folder), { recursive: true }))
   }));
   done();
};

export default staticFoldersCreatePlugin;