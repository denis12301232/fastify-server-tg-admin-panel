import type { SocketTyped, ServerTyped } from '@/types/index.js'
import SocketSchemas from '@/api/schemas/SocketSchemas.js'
import { v4 } from 'uuid'
import { app } from '@/main.js'


export default function useMeetEvents(io: ServerTyped) {
   const { redis } = app;
   const events = {
      'meet:create': onMeetCreate,
      'meet:leave': onMeetLeave,
      'meet:join': onMeetJoin
   }

   async function onMeetCreate(this: SocketTyped, title: string) {
      const { error } = SocketSchemas.meetCreate.validate({ title });
      if (error) {
         return this.disconnect(true);
      }
      const meetId = v4();
      await redis.hSet('meets', meetId, JSON.stringify({ title }));
      this.emit('meet:create', meetId);
   }

   async function onMeetJoin(this: SocketTyped, meetId: string) {
      const { error } = SocketSchemas.meetJoin.validate({ meetId });
      if (error) {
         return this.disconnect(true);
      }
      const info = await redis.hGet('meets', meetId);
      if (!info) {
         return this.emit('error:meet-join', 404, 'Not found');
      }
      this.join(meetId);
      const clientsIds = io.sockets.adapter.rooms.get(meetId);
      for (const id of clientsIds || []) {
         const user = io.sockets.sockets.get(id)?.data.user;
         if (user?._id !== this.data.user?._id) {
            io.to(id).emit('webrtc:add-peer', this.data.user?._id as string, false, this.data.user);
            this.emit('webrtc:add-peer', user?._id as string, true, user);
         }
      }
   }

   async function onMeetLeave(this: SocketTyped, meetId: string) {
      const { error } = SocketSchemas.meetLeave.validate({ meetId });
      if (error) {
         return this.disconnect(true);
      }
      this.broadcast.to(meetId).emit('webrtc:remove-peer', this.data.user?._id as string);
      this.leave(meetId);
      const clients = io.sockets.adapter.rooms.get(meetId);

      if (!clients?.size) {
         redis.hDel('meets', meetId);
      }
   }

   return events;
}