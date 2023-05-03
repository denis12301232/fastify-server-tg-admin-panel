import fastify from 'fastify'
import factory from '@/factory'
import SocketEvents from '@/api/io'


export const app = fastify({ logger: true });

async function start() {
   try {
      await factory(app);
      new SocketEvents(app.io);
      await app.listen({ port: process.env.PORT, host: process.env.HOST });
   } catch (e) {
      app.log.error(e);
      process.exit(1);
   }
}

start();