import type { FastifyPluginCallback, onCloseHookHandler } from 'fastify'
import fp from 'fastify-plugin';
import { createClient, type RedisClientOptions } from 'redis';


const onClose: onCloseHookHandler = (app, done) => {
   app.redis.disconnect().finally(done);
}

const redisPlugin: FastifyPluginCallback<RedisClientOptions> = async (app, options, done) => {
   try {
      const client = createClient(options);
      app.decorate('redis', client);
      app.addHook('onClose', onClose);
      client.on('error', (e) => app.log.error(e));
      await client.connect();
      app.log.info(`Redis client connect at ${process.env.REDIS_URL}`);
      done();
   } catch (e) {
      if (e instanceof Error) {
         done(e);
      }
   }
};

export default fp(redisPlugin);
