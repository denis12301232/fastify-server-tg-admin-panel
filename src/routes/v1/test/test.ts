import type { FastifyInstance } from 'fastify'

export default async function MessangerRoutes(fastify: FastifyInstance) {
   fastify.get('/', async (request, reply) => {

      return { test: 'test' }
   });
}