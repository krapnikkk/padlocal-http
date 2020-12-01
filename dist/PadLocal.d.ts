import * as pb from "padlocal-client-ts/dist/proto/padlocal_pb";
import { IMessage, IMessageRevokeInfo, Media, miniProgramShareInfo, PadLocalClientConfig, ReplyComment, ShareInfo, SNSImageMoment, SNSMomentType, SNSMonentOption } from "./interface";
declare const PadLocal: {
    isLogin: boolean;
    install: (config: PadLocalClientConfig) => void;
    login: () => Promise<Object>;
    logout: () => Promise<unknown>;
    sendMessage: (msg: IMessage, atUserList?: string[]) => Promise<Object>;
    revokeMessage: (msgId: string, toUserName: string, revokeInfo: IMessageRevokeInfo) => Promise<Object>;
    sendMedia: (id: string, file: string, type: Media) => Promise<Object>;
    sendAppMessageLink: (id: string, info: ShareInfo) => Promise<Object>;
    sendAppMessageMiniProgram: (id: string, info: miniProgramShareInfo) => Promise<Object>;
    sendContactCardMessage: (id: string, userName: string) => Promise<Object>;
    addContact: (userName: string, greeting: string) => Promise<Object>;
    deleteContact: (userName: string) => Promise<Object>;
    getContact: (userName: string) => Promise<unknown>;
    getContactQRCode: () => Promise<Object>;
    acceptUser: (stranger: string, ticket: string) => Promise<Object>;
    searchContact: (userName: string) => Promise<Object>;
    updateSelfNickName: (nickname: string) => Promise<Object>;
    updateSelfSignature: (signature: string) => Promise<Object>;
    zombieTest: (userName: string) => Promise<Object>;
    updateContactRemark: (userName: string, remark: string) => Promise<Object>;
    createChatRoom: (userNameList: string[]) => Promise<Object>;
    getChatRoomMembers: (roomId: string) => Promise<Object>;
    getChatRoomQrCode: (roomId: string) => Promise<Object>;
    getChatRoomMember: (roomId: string, userName: string) => Promise<Object>;
    setChatRoomAnnouncement: (roomId: string, announcement: string) => Promise<Object>;
    setChatRoomName: (roomId: string, roomName: string) => Promise<Object>;
    addChatRoomMember: (roomId: string, userName: string) => Promise<Object>;
    deleteChatRoomMember: (roomId: string, userName: string) => Promise<Object>;
    inviteChatRoomMember: (roomId: string, userName: string) => Promise<Object>;
    quitChatRoom: (roomId: string) => Promise<Object>;
    getLabelList: () => Promise<Object>;
    addLabel: (label: string) => Promise<Object>;
    removeLabel: (labelId: number) => Promise<Object>;
    setContactLabel: (userName: string, labelList: number[]) => Promise<Object>;
    snsGetTimeline: (maxId: string) => Promise<Object>;
    snsGetUserTimeline: (maxId: string, userId: string) => Promise<Object>;
    snsGetMoment: (momentId: string) => Promise<Object>;
    snsSendMoment: (type: SNSMomentType, content: string | SNSImageMoment | ShareInfo, options: SNSMonentOption) => Promise<Object>;
    uploadImages: (imageFilePathList: string[], description?: string | undefined) => Promise<pb.SnsImageUrl[]>;
    snsRemoveMoment: (momentId: string) => Promise<Object>;
    snsSendComment: (momentId: string, momentOwnerUserName: string, commentText: string, replyTo?: ReplyComment | undefined) => Promise<Object>;
    snsLikeMoment: (momentId: string, momentOwnerUserName: string) => Promise<Object>;
    snsUnlikeMoment: (momentId: string) => Promise<Object>;
    snsRemoveMomentComment: (momentId: string, commentId: string) => Promise<Object>;
    snsMakeMomentPrivate: (momentId: string) => Promise<Object>;
    snsMakeMomentPublic: (momentId: string) => Promise<Object>;
};
export default PadLocal;
