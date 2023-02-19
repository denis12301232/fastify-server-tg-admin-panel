import type { WebSocket } from 'ws'


declare module 'ws' {
  interface WebSocket {
    id: string;
  }
}
