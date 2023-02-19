import type { FastifyPluginCallback } from 'fastify'
import { access, mkdir } from 'fs/promises'
import { constants } from 'fs'
import { resolve } from 'path'


const createStaticFolders: FastifyPluginCallback<any> = async (fastify, options, done) => {
   await Promise.allSettled([
      access(resolve(__dirname, '../../static/audio'), constants.R_OK | constants.W_OK)
         .catch(async (e) => await mkdir(resolve(__dirname, '../../static/audio'), { recursive: true })),
      access(resolve(__dirname, '../../static/images/avatars'), constants.R_OK | constants.W_OK)
         .catch(async (e) => await mkdir(resolve(__dirname, '../../static/images/avatars'), { recursive: true })),
      access(resolve(__dirname, '../../static/media'), constants.R_OK | constants.W_OK)
         .catch(async (e) => await mkdir(resolve(__dirname, '../../static/media'), { recursive: true })),
      access(resolve(__dirname, '../../public'), constants.R_OK | constants.W_OK)
         .catch(async (e) => await mkdir(resolve(__dirname, '../../public'), { recursive: true }))
   ]);
   done();
};

export default createStaticFolders;
