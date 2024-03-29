export interface IMessage {
    message: string;
    id: string;
}
export interface IMessageRevokeInfo {
    clientMsgId: string;
    newClientMsgId: string;
    createTime: number;
}
export interface PadLocalClientConfig {
    serverHost?: string;
    serverPort?: string;
    token: string;
    serverCAFilePath?: string;
    skipPrintVersion?: boolean;
}
export interface ServerConfig {
    postUrl: string;
    port: string;
}
export declare enum Media {
    Audio = 0,
    Video = 1,
    Image = 2,
    File = 3
}
export declare enum SNSMomentType {
    Text = 0,
    Image = 1,
    Url = 2
}
export interface SNSMonentOption {
    isPrivate?: boolean;
    cannotseeusernameList?: string[];
    canseeusernameList?: string[];
    atusernameList?: string[];
}
export interface ReplyComment {
    replyCommentId: string;
    replyCommentNickName: string;
    replyCommentUsername: string;
}
export interface ShareInfo {
    title: string;
    url: string;
    desc: string;
    thumburl?: string;
}
export interface SNSImageMoment {
    imageFilePathList: string[];
    description: string;
}
export interface miniProgramShareInfo extends ShareInfo {
    mpThumbFilePath: string;
    mpappusername: string;
    mpappname: string;
    mpappid: string;
    appiconurl: string;
    mpapppath: string;
}
