import './loadEnv.js';
import fastify from 'fastify';
import factory from '@/factory.js';
import SocketEvents from '@/api/io/index.js';

export const app = fastify({ logger: true });
process.on('SIGTERM', onShutDown);
process.on('SIGINT', onShutDown);

main();

async function main() {
  try {
    await factory(app);
    new SocketEvents(app.io);
    app.listen({ port: process.env.PORT, host: process.env.HOST });
  } catch (e) {
    app.log.error(e);
    app.close().then(() => process.exit(1));
  }
}

function onShutDown() {
  app.close().then(() => process.exit(0));
}
