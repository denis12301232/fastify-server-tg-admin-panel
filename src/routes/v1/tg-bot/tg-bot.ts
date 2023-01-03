import type { FastifyInstance } from 'fastify'
import { webhookCallback } from 'grammy'
import { bot } from '~/bot'


export default async function TgBotRoutes(fastify: FastifyInstance) {
   fastify.post('/', webhookCallback(bot, 'fastify'));
}