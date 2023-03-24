import type { FastifyPluginCallback, onCloseHookHandler } from 'fastify'
import fp from 'fastify-plugin';
import { Server, type ServerOptions } from 'socket.io'


const onClose: onCloseHookHandler = (app, done) => {
   app.io.close();
   done();
}
const socketIoPlugin: FastifyPluginCallback<Partial<ServerOptions>> = async (app, options, done) => {
   app.decorate('io', new Server(app.server, options));
   app.addHook('onClose', onClose);
   done();
};

export default fp(socketIoPlugin);
