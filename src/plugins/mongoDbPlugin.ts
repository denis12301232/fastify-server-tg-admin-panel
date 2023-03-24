import type { FastifyPluginCallback } from 'fastify'
import mongoose from 'mongoose'
import { useCreateRoot } from '@/hooks'


interface MongoConfig { url: string, opts: mongoose.ConnectOptions }

const mongoDbPlugin: FastifyPluginCallback<MongoConfig> = async (app, options, done) => {
   mongoose.set('strictQuery', false);
   mongoose.connect(options.url, options.opts)
      .then(() => app.log.info(`Connected to db '${process.env.MONGO_NAME}' at ${process.env.MONGO_URL}`))
      .then(useCreateRoot)
      .catch(app.log.error)
      .finally(done);
};

export default mongoDbPlugin;
