export namespace SocketTypes {
  export interface ChatTyping {
    chatId: string;
    userName: string;
    userId: string;
  }

  export interface ChatCall {
    chatId: string;
  }

  export interface ChatCallAnswer {
    chatId: string;
    answer: boolean;
  }

  export interface ChatCallCancel {
    chatId: string;
  }

  export interface WebRtcAddPeer {
    chatId: string;
  }

  export interface WebRtcRemovePeer {
    chatId: string;
  }

  export interface WebRtcSdp {
    peerId: string;
    sdp: RTCSessionDescriptionInit;
  }

  export interface WebRtcIce {
    peerId: string;
    ice: RTCIceCandidate;
  }

  export interface MeetCreate {
    title: string;
  }

  export interface MeetJoin {
    meetId: string;
  }

  export interface MeetLeave {
    meetId: string;
  }
}
