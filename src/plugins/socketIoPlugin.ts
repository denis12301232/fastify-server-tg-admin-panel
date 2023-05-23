import type { FastifyPluginCallback, onCloseHookHandler } from 'fastify';
import type { ServerTyped } from '@/types/index.js';
import fp from 'fastify-plugin';
import { Server, type ServerOptions } from 'socket.io';

const onClose: onCloseHookHandler = (app, done) => {
  app.io.close();
  done();
};
const socketIoPlugin: FastifyPluginCallback<Partial<ServerOptions>> = async (app, options, done) => {
  app.decorate('io', new Server(app.server, options) as ServerTyped);
  app.addHook('onClose', onClose);
  done();
};

export default fp(socketIoPlugin);
