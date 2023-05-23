import type { SocketTypes } from '@/types/index.js'
import Joi from 'joi'


export default class SocketSchemas {
   static readonly chatTyping = Joi.object<SocketTypes.ChatTyping>({
      chatId: Joi.string().required(),
      userName: Joi.string().required(),
      userId: Joi.string().required(),
   }).required();

   static readonly chatCall = Joi.object<SocketTypes.ChatCall>({
      chatId: Joi.string().required()
   }).required();

   static readonly chatCallAnswer = Joi.object<SocketTypes.ChatCallAnswer>({
      chatId: Joi.string().required(),
      answer: Joi.boolean().required(),
   }).required();

   static readonly chatCallCancel = Joi.object<SocketTypes.ChatCallCancel>({
      chatId: Joi.string().required()
   }).required();

   static readonly webRtcAddPeer = Joi.object<SocketTypes.WebRtcAddPeer>({
      chatId: Joi.string().required()
   }).required();

   static readonly webRtcRemovePeer = Joi.object<SocketTypes.WebRtcRemovePeer>({
      chatId: Joi.string().required()
   }).required();

   static readonly webRtcSdp = Joi.object<SocketTypes.WebRtcSdp>({
      peerId: Joi.string().required(),
      sdp: Joi.object<RTCSessionDescriptionInit>({
         sdp: Joi.string().required(),
         type: Joi.string().required().allow('answer', 'offer', 'pranswer', 'rollback')
      }).required()
   }).required();

   static readonly webRtcIce = Joi.object<SocketTypes.WebRtcIce>({
      peerId: Joi.string().required(),
   }).required();

   static readonly meetCreate = Joi.object<SocketTypes.MeetCreate>({
      title: Joi.string().required(),
   }).required();

   static readonly meetJoin = Joi.object<SocketTypes.MeetJoin>({
      meetId: Joi.string().required(),
   }).required();

   static readonly meetLeave = Joi.object<SocketTypes.MeetLeave>({
      meetId: Joi.string().required()
   }).required();
}