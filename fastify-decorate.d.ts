import type { UserDto } from '@/dto/UserDto'

declare module 'fastify' {
   export interface FastifyRequest {
      user?: UserDto;
   }
}