import type { FastifyPluginCallback } from 'fastify'
import { bot } from '~/bot'


const setBotWebhook: FastifyPluginCallback<any> = async (fastify, options, done) => {
   bot.api.setWebhook(`${process.env.SERVER_DOMAIN}/api/v1/tg-bot`)
      .then(() => fastify.log.info('Bot webhook was set'))
      .catch((e: Error) => fastify.log.error(e.message))
      .finally(done);
};

export default setBotWebhook;