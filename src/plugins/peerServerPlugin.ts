import type { FastifyPluginCallback } from 'fastify'


const peerServerPlugin: FastifyPluginCallback<any> = async (app, options, done) => {
   try {
      const { PeerServer } = await import('peer');
      const peerServer = PeerServer({ path: '/', host: '0.0.0.0', port: 9000 });

      peerServer.on('connection', (client) => app.log.info({
         message: 'Peer:new client connected', clientId: client.getId(), clientToken: client.getToken()
      }));
      peerServer.on('disconnect', (client) => {
         app.log.info({
            message: 'Peer:client disconnected', clientId: client.getId(), clientToken: client.getToken()
         })
      });
      done();
   } catch (e) {
      if (e instanceof Error) done(e);
   }
};

export default peerServerPlugin;
