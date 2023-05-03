import type { SocketTyped, ServerTyped } from '@/types'
import SocketSchemas from '@/api/schemas/SocketSchemas'
import { v4 } from 'uuid'


export default function useMeetEvents(io: ServerTyped) {
   const events = {
      'meet:create': onMeetCreate,
      'meet:leave': onMeetLeave,
      'meet:join': onMeetJoin
   }

   function onMeetCreate(this: SocketTyped, title: string) {
      const { error } = SocketSchemas.meetCreate.validate({ title });
      if (error) {
         return this.disconnect(true);
      }
      const meetId = v4();
      this.emit('meet:create', meetId);
   }

   function onMeetJoin(this: SocketTyped, meetId: string) {
      const { error } = SocketSchemas.meetJoin.validate({ meetId });
      if (error) {
         return this.disconnect(true);
      }
      this.join(meetId);
      const clientsIds = io.sockets.adapter.rooms.get(meetId);
      for (const id of clientsIds || []) {
         const user = io.sockets.sockets.get(id)?.data.user;
         if (user?._id !== this.data.user?._id) {
            io.to(id).emit('webrtc:add-peer', this.data.user!._id, false, this.data.user);
            this.emit('webrtc:add-peer', user?._id!, true, user);
         }
      }
   }

   function onMeetLeave(this: SocketTyped, meetId: string) {
      const { error } = SocketSchemas.meetLeave.validate({ meetId });
      if (error) {
         return this.disconnect(true);
      }
      this.broadcast.to(meetId).emit('webrtc:remove-peer', this.data.user!._id);
      this.leave(meetId);
   }
   
   return events;
}