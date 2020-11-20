export interface IMessage {
    message: string,
    id: string
}

export interface PadLocalClientConfig {
    serverHost: string,
    serverPort: string,
    token: string,
    serverCAFilePath?: string,
    skipPrintVersion?: boolean
}

export interface ServerConfig {
    postUrl: string;
    port: string;
}

export enum Media {
    Audio,
    Video,
    Image,
    File
}

export enum SNSMomentType {
    Text,
    Image,
    Url
}

export interface SNSMonentOption {
    isPrivate?: boolean,
    cannotseeusernameList?: string[],
    canseeusernameList?: string[],
    atusernameList?: string[],
}

export interface ReplyComment {
    replyCommentId: string,
    replyCommentNickName: string,
    replyCommentUsername: string
}

export interface ShareInfo {
    title: string,
    url: string,
    desc: string,
    thumburl?: string
}

export interface SNSImageMoment {
    imageFilePathList: string[],
    description: string,
}

export interface miniProgramShareInfo extends ShareInfo {
    mpThumbFilePath: string,
    mpappusername: string,
    mpappname: string,
    mpappid: string,
    appiconurl: string,
    mpapppath: string
}

