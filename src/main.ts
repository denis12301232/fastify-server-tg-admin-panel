import fastify from 'fastify'
import factory from '@/factory'
import setSocketListers from '@/api/io'


export const app = fastify({ logger: true });

async function start() {
   try {
      await factory(app);
      setSocketListers(app.io);
      await app.listen({ port: process.env.PORT, host: process.env.HOST });
   } catch (e) {
      app.log.error(e);
      process.exit(1);
   }
}

start();