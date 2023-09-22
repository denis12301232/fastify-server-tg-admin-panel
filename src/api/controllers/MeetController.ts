import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { MeetTypes } from '@/types/index.js';
import { MeetService, NoticeService } from '@/api/services/index.js';

export default class MeetController {
  static async create(this: FastifyInstance, request: FastifyRequest<MeetTypes.Create>) {
    const result = await MeetService.create(request.user._id, request.body);
    return result;
  }

  static async update(this: FastifyInstance, request: FastifyRequest<MeetTypes.Update>) {
    const result = await MeetService.update(request.params.id, request.body);
    return result;
  }

  static async show(request: FastifyRequest<MeetTypes.Show>) {
    const meet = await MeetService.show(request.params.id);
    return meet;
  }

  static async join(this: FastifyInstance, request: FastifyRequest<MeetTypes.Join>) {
    const result = await MeetService.join(request.params.id, request.user._id);
    const socket = Array.from(this.io.sockets.sockets.values()).find(
      (socket) => socket.data.user?._id === request.user._id
    );
    socket?.join(request.params.id);

    const clientsIds = this.io.sockets.adapter.rooms.get(request.params.id) || [];
    for (const id of clientsIds) {
      const user = this.io.sockets.sockets.get(id)?.data.user;
      if (user?._id !== socket?.data.user?._id) {
        this.io.to(id).emit('webrtc:add-peer', socket?.data.user?._id as string, false, socket?.data.user);
        socket?.emit('webrtc:add-peer', user?._id as string, true, user);
      }
    }

    return result;
  }

  static async leave(this: FastifyInstance, request: FastifyRequest<MeetTypes.Leave>) {
    const result = await MeetService.leave(request.params.id, request.user._id);
    const socket = Array.from(this.io.sockets.sockets.values()).find(
      (socket) => socket.data.user?._id === request.user._id
    );
    socket?.broadcast.to(request.params.id).emit('webrtc:remove-peer', request.user._id);
    socket?.leave(request.params.id);
    const clients = this.io.sockets.adapter.rooms.get(request.params.id);

    if (!clients?.size) {
      MeetService.destroy(request.params.id);
    }

    return result;
  }

  static async invite(this: FastifyInstance, request: FastifyRequest<MeetTypes.Invite>) {
    const result = await MeetService.invite(request.params.id, request.body);
    const sockets = Array.from(this.io.sockets.sockets.values());

    for (const userId of request.body) {
      const notice = await NoticeService.store(userId, {
        title: 'Invite to meet',
        text: `/meets/${request.params.id}`,
      });
      sockets.find((socket) => socket.data.user?._id === userId)?.emit('notice:new', notice);
    }

    return result;
  }
}
