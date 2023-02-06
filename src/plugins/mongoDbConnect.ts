import type { FastifyPluginCallback } from 'fastify'
import mongoose from 'mongoose'
import { useCreateRoot } from '@/hooks'


const mongoDbConnect: FastifyPluginCallback<any> = async (fastify, options, done) => {
   mongoose.set('strictQuery', false);
   mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_NAME })
      .then(() => fastify.log.info(`DB connected`))
      .then(useCreateRoot)
      .catch(fastify.log.error)
      .finally(done);
};

export default mongoDbConnect;
