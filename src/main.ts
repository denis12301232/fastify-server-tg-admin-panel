import 'module-alias/register'
import Fastify from 'fastify'
import { factory } from '@/factory'


export const fastify = Fastify({ logger: true });
export const log = fastify.log;

async function start() {
   try {
      await factory(fastify);
      await fastify.listen({ port: process.env.PORT || 5000 })
         .then(() => fastify.log.info(`Server started on ${process.env.PORT} port`));
   } catch (e) {
      fastify.log.error(e);
      process.exit(1);
   }
}

start();
