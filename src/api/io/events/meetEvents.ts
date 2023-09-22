import type { SocketTyped, ServerTyped } from '@/types/index.js';
import SocketSchemas from '@/api/schemas/SocketSchemas.js';
import { v4 } from 'uuid';
import { app } from '@/main.js';
import Models from '@/models/mongo/index.js';

export default function useMeetEvents(io: ServerTyped) {
  const { redis } = app;
  const events = {

    'meet:leave': onMeetLeave,
    'meet:join': onMeetJoin,
  };


  async function onMeetJoin(this: SocketTyped, meetId: string) {
    const { error } = SocketSchemas.meetJoin.validate({ meetId });

    if (error) {
      return this.disconnect(true);
    }

    const [info] = await Promise.all([
      redis.json.GET('meets', { path: [`.${meetId}`] }),
      redis.json.ARRAPPEND('meets', `.${meetId}.members`, this.data.user?._id as string),
    ]);

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
    redis.json.GET('meets', { path: `.${meetId}.members` }).then((members) =>
      redis.json.SET(
        'meets',
        `.${meetId}.members`,
        (members as string[]).filter((m) => m !== this.data.user?._id)
      )
    );

    if (!clients?.size) {
      redis.json.DEL('meets', `.${meetId}`);
    }
  }

  return events;
}
