import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { unlink } from 'fs/promises'


export function useDeleteTempFile(fileField: keyof FastifyReply['temp']) {
   return async function (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
      const file = reply.temp[fileField];
      file && (await unlink(file));
      return done();
   }
}