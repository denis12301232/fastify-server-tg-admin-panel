import type { WsMessage, WsEvent } from '@/types/interfaces'


export class WsMessageDto implements WsMessage {
   readonly event: WsEvent;
   readonly payload: any;

   constructor(msg: WsMessage) {
      this.event = msg.event;
      this.payload = msg.payload;
   }
}