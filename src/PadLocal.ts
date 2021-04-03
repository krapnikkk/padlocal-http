import { PadLocalClient } from "padlocal-client-ts";
import { Contact, LoginPolicy, LoginType, Message, MessageRevokeInfo, QRCodeEvent, SyncEvent } from "padlocal-client-ts/dist/proto/padlocal_pb";
import { genIdempotentId } from "padlocal-client-ts/dist/utils/Utils";
import * as pb from "padlocal-client-ts/dist/proto/padlocal_pb";
import { IMessage, IMessageRevokeInfo, Media, miniProgramShareInfo, PadLocalClientConfig, ReplyComment, ShareInfo, SNSImageMoment, SNSMomentType, SNSMonentOption } from "./interface";
import fs from "fs";
import { parseBuffer } from "music-metadata"
import { secondsToMilliSeconds } from "./utils";
import MessageHandler from "./MessageHandler";

let client: PadLocalClient;
const PadLocal = {
    isLogin: false,
    install: async (config: PadLocalClientConfig) => {
        try {
            let { token } = config;
            // client = new PadLocalClient(`${serverHost}:${serverPort}`, token, serverCAFilePath);
            client = await PadLocalClient.create(token);
        } catch (e) {
            console.warn(e);
        }
    },
    login: async (): Promise<Object> => {
        return new Promise(async (resolve, reject) => {
            if (!client) {
                resolve("install first");
            }
            await client.api.login(LoginPolicy.DEFAULT, {
                onLoginStart: (loginType: LoginType) => {
                    console.log("start login with type: ", loginType);
                },
                onOneClickEvent: (qrCodeEvent: QRCodeEvent) => {
                    let response = qrCodeEvent.toObject();
                    console.log("on one click event: ", JSON.stringify(response));
                    if (response.status == 1) {
                        resolve({ response });
                    }
                },
                onQrCodeEvent: (qrCodeEvent: QRCodeEvent) => {
                    let response = qrCodeEvent.toObject();
                    console.log("on qr code event: ", JSON.stringify(qrCodeEvent.toObject()));
                    resolve({ response });
                },
                onLoginSuccess(contact: Contact) {
                    client.on("message", (messageList: Message[]) => {
                        for (const message of messageList) {
                            console.log("on message: ", JSON.stringify(message.toObject()));
                            MessageHandler.post(message.toObject())
                        }
                    });
                    PadLocal.isLogin = true;
                    let response = contact.toObject();
                    resolve({ response });
                },
                onSync: (_syncEvent: SyncEvent) => {
                    // for (const contact of _syncEvent.getContactList()) {
                    //     console.log("login on sync contact: ", JSON.stringify(contact.toObject()));
                    // }

                    // for (const message of _syncEvent.getMessageList()) {
                    //     console.log("login on sync message: ", JSON.stringify(message.toObject()));
                    // }
                }
            }).catch(e => {
                reject(e);
            });

            // client.on("contact", (contactList: Contact[]) => {
            //     for (const contact of contactList) {
            //         console.log("on contact: ", JSON.stringify(contact.toObject()));
            //         MessageHandler.post(contact.toObject())
            //     }
            // });

            client.on("error", (e) => {
                console.log("error:", e);
            })
        })
    },
    logout: async () => {
        return new Promise(async (resolve) => {
            if (client) {
                const logoutResponse = await client.api.logout();
                PadLocal.isLogin = false;
                let response = logoutResponse.toObject();
                resolve({ response })
            }
        })
    },
    sendMessage: async (msg: IMessage, atUserList: string[] = []): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                let { id, message } = msg;
                let idempotentId = genIdempotentId();
                let sendTextMessageResponse = await client.api.sendTextMessage(
                    idempotentId,
                    id,
                    message,
                    atUserList
                );
                let response = sendTextMessageResponse.toObject();
                resolve({ response })
            } catch (e) {
                resolve(e);
            }

        })
    },
    revokeMessage: async (msgId: string, toUserName: string, revokeInfo: IMessageRevokeInfo): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                let { clientMsgId, newClientMsgId, createTime } = revokeInfo;
                const fromUserName = await client.selfContact!.getUsername();
                await client.api.revokeMessage(
                    msgId,
                    fromUserName,
                    toUserName,
                    new MessageRevokeInfo().setClientmsgid(clientMsgId).setNewclientmsgid(newClientMsgId).setCreatetime(createTime)
                );
                resolve({ "msg": "done" })
            } catch (e) {
                resolve(e);
            }

        })
    },
    sendMedia: async (id: string, file: string, type: Media): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const fileData: Buffer = fs.readFileSync(file);
                let sendVideoMessageResponse;
                switch (type) {
                    case Media.Video:
                        sendVideoMessageResponse = await client.api.sendVideoMessage(genIdempotentId(), id, fileData);
                        break;
                    case Media.Image:
                        sendVideoMessageResponse = await client.api.sendImageMessage(genIdempotentId(), id, fileData);
                        break;
                    case Media.Audio:
                        const audioMetadata = await parseBuffer(fileData);
                        const duration = audioMetadata.format.duration as number;
                        const milliSeconds = secondsToMilliSeconds(duration);
                        sendVideoMessageResponse = await client.api.sendVoiceMessage(genIdempotentId(), id, fileData, milliSeconds)
                        break;
                    default:
                        const fileName = file.split("/").pop() as string;
                        sendVideoMessageResponse = await client.api.sendFileMessage(genIdempotentId(), id, fileData, fileName);
                        break;
                }
                let response = sendVideoMessageResponse.toObject()
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    sendAppMessageLink: async (id: string, info: ShareInfo): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const { title, desc, url, thumburl } = info;
                const msgId = await client.api.sendMessageLink(
                    genIdempotentId(),
                    id,
                    new pb.AppMessageLink()
                        .setTitle(title)
                        .setDescription(desc)
                        .setUrl(url)
                        .setThumburl(
                            thumburl!
                        )
                )
                resolve({ msgId });
            } catch (e) {
                resolve(e);
            }

        })
    },
    sendAppMessageMiniProgram: async (id: string, info: miniProgramShareInfo): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const { title, desc, url, mpThumbFilePath, mpappusername, mpappname, mpappid, appiconurl } = info;
                const thumbImageData: Buffer = fs.readFileSync(mpThumbFilePath);
                const msgId = await client.api.sendMessageMiniProgram(
                    genIdempotentId(),
                    id,
                    new pb.AppMessageMiniProgram()
                        .setTitle(title)
                        .setDescription(desc)
                        .setUrl(url)
                        .setMpappusername(mpappusername)
                        .setMpappname(mpappname)
                        .setMpappid(mpappid)
                        .setMpappiconurl(appiconurl)
                        .setMpapppath("pages/home/index.html?utm_medium=userid_123456")
                        .setThumbimage(thumbImageData), thumbImageData
                )
                resolve({ msgId });
            } catch (e) {
                resolve(e);
            }

        })
    },
    sendContactCardMessage: async (id: string, userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const searchRes = await client.api.searchContact(userName);
                const contact = searchRes.getContact()!;
                const sendContactCardMessageResponse = await client.api.sendContactCardMessage(genIdempotentId(), id, contact);
                let response = sendContactCardMessageResponse.toObject()
                resolve({ response });
            } catch (e) {
                resolve(e);
            }

        })
    },
    addContact: async (userName: string, greeting: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const response = await client.api.searchContact(userName);
                await client.api.addContact(
                    response.getContact()!.getUsername(),
                    response.getAntispamticket(),
                    pb.AddContactScene.WECHAT_ID,
                    greeting
                );
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    deleteContact: async (userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.deleteContact(userName);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    getContact: async (userName: string) => {
        return new Promise(async (resolve) => {
            try {
                const contact = await client.api.getContact(userName);
                let response = contact.toObject();
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    getContactQRCode: async (): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const contactName = await client.selfContact!.getUsername();
                const response = await client.api.getContactQRCode(contactName, 2);
                const qrcode = "data:image/png;base64," + response.getQrcode_asB64()
                resolve({ qrcode });
            } catch (e) {
                resolve(e);
            }
        })
    },
    acceptUser: async (userName: string, stranger: string, ticket: string, scene: number): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.acceptUser(userName, stranger, ticket, scene);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    searchContact: async (userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const contact = await client.api.searchContact(userName);
                let response = contact.toObject();
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    updateSelfNickName: async (nickname: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.updateSelfNickName(nickname);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    updateSelfSignature: async (signature: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.updateSelfSignature(signature);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    zombieTest: async (userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const status = await client.api.zombieTest(userName);
                resolve({ status });
            } catch (e) {
                resolve(e);
            }
        })
    },
    updateContactRemark: async (userName: string, remark: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.updateContactRemark(userName, remark);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    createChatRoom: async (userNameList: string[]): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const id = genIdempotentId();
                const chatroom = await client.api.createChatRoom(id, userNameList);
                let response = chatroom.toObject();
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    getChatRoomMembers: async (roomId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const memberList = await client.api.getChatRoomMembers(roomId);
                let response = memberList.map((menber) => {
                    return menber.toObject();
                })
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    getChatRoomQrCode: async (roomId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const response = await client.api.getChatRoomQrCode(roomId);
                const qrcode = "data:image/png;base64," + response.getQrcode_asB64()
                resolve({ qrcode });
            } catch (e) {
                resolve(e);
            }
        })
    },
    getChatRoomMember: async (roomId: string, userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const contact = await client.api.getChatRoomMember(roomId, userName);
                let response = contact.toObject();
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    setChatRoomAnnouncement: async (roomId: string, announcement: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.setChatRoomAnnouncement(roomId, announcement);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    setChatRoomName: async (roomId: string, roomName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.setChatRoomName(roomId, roomName);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    addChatRoomMember: async (roomId: string, userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.addChatRoomMember(roomId, userName);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    deleteChatRoomMember: async (roomId: string, userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.deleteChatRoomMember(roomId, userName);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    inviteChatRoomMember: async (roomId: string, userName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.addChatRoomMember(roomId, userName);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    quitChatRoom: async (roomId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.quitChatRoom(roomId);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    getLabelList: async (): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const labelList = await client.api.getLabelList();
                resolve({ labelList });
            } catch (e) {
                resolve(e);
            }
        })
    },
    addLabel: async (label: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const labelId = await client.api.addLabel(label);
                resolve({ labelId });
            } catch (e) {
                resolve(e);
            }
        })
    },
    removeLabel: async (labelId: number): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.removeLabel(labelId);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    setContactLabel: async (userName: string, labelList: number[]): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.setContactLabel(userName, labelList);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsGetTimeline: async (maxId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                let momentList = await client.api.snsGetTimeline(maxId);
                let response = momentList.map((moment) => {
                    return moment.toObject()
                })
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsGetUserTimeline: async (maxId: string, userId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                let momentList = await client.api.snsGetUserPage(userId, maxId);
                let response = momentList.map((moment) => {
                    return moment.toObject()
                })
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsGetMoment: async (momentId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const snsMoment = await client.api.snsGetMoment(momentId);
                resolve(snsMoment.toObject());
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsSendMoment: async (type: SNSMomentType, content: string | SNSImageMoment | ShareInfo, options: SNSMonentOption): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                let snsMoment: pb.SnsMoment;
                const id = genIdempotentId();
                const { isPrivate, cannotseeusernameList, canseeusernameList, atusernameList } = options;
                const snsSendMomentOptions = new pb.SnsSendMomentOptions();
                if (isPrivate) {
                    snsSendMomentOptions.setIsprivate(isPrivate);
                } else if (cannotseeusernameList && cannotseeusernameList.length > 1) {
                    snsSendMomentOptions.setCannotseeusernameList(cannotseeusernameList);
                } else if (canseeusernameList && canseeusernameList.length > 1) {
                    snsSendMomentOptions.setCanseeusernameList(canseeusernameList);
                }

                if (atusernameList && atusernameList.length > 1) {
                    snsSendMomentOptions.setAtusernameList(atusernameList);
                }

                switch (type) {
                    case SNSMomentType.Text:
                        const textMoment = new pb.SnsSendMomentText().setText(content as string);
                        snsMoment = await client.api.snsSendMoment(
                            id,
                            textMoment,
                            snsSendMomentOptions
                        );
                        break;
                    case SNSMomentType.Image:
                        let { imageFilePathList, description } = content as SNSImageMoment;
                        const imageMoment = new pb.SnsSendMomentImages().setText(description as string);
                        const imageUrlList: pb.SnsImageUrl[] = await PadLocal.uploadImages(imageFilePathList);
                        imageMoment.setImageurlList(imageUrlList);
                        snsMoment = await client.api.snsSendMoment(
                            id,
                            imageMoment,
                            snsSendMomentOptions
                        );
                        break;
                    case SNSMomentType.Url:
                        let { url, title, thumburl, desc } = content as ShareInfo;
                        const urlMoment = new pb.SnsSendMomentUrl().setText(desc);
                        const coverImageUrlList: pb.SnsImageUrl[] = await PadLocal.uploadImages([thumburl!]);
                        urlMoment.setImageurl(coverImageUrlList[0]).setUrl(url).setUrltitle(title);
                        snsMoment = await client.api.snsSendMoment(
                            id,
                            urlMoment,
                            snsSendMomentOptions
                        );
                        break;
                    default:
                        snsMoment = await client.api.snsSendMoment(
                            id,
                            new pb.SnsSendMomentText().setText(content as string),
                            snsSendMomentOptions
                        );
                        break;
                }
                let response = snsMoment.toObject();
                resolve({ response });
            } catch (e) {
                resolve(e);
            }
        })
    },
    uploadImages: async (imageFilePathList: string[], description?: string): Promise<pb.SnsImageUrl[]> => {
        const ret: pb.SnsImageUrl[] = [];
        for (let i = 0; i < imageFilePathList.length; ++i) {
            const imageData: Buffer = fs.readFileSync(imageFilePathList[i]);
            const des = i === 0 ? description : undefined;
            const imageUploadRes = await client.api.snsUploadImage(imageData, des);
            ret.push(imageUploadRes.getUrl()!);
        }
        return ret;
    },
    snsRemoveMoment: async (momentId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.snsRemoveMoment(momentId);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsSendComment: async (momentId: string, momentOwnerUserName: string, commentText: string, replyTo?: ReplyComment): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                let id = genIdempotentId();
                let snsSendCommentReplyTo = new pb.SnsSendCommentReplyTo();
                if (replyTo) {
                    let { replyCommentId,
                        replyCommentNickName,
                        replyCommentUsername } = replyTo;
                    snsSendCommentReplyTo.setCommentid(replyCommentId)
                        .setCommentnickname(replyCommentNickName)
                        .setCommentusername(replyCommentUsername);
                }
                const snsMoment = await client.api.snsSendComment(id, momentId, momentOwnerUserName, commentText, snsSendCommentReplyTo);
                resolve({ snsMoment });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsLikeMoment: async (momentId: string, momentOwnerUserName: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                const snsMoment = await client.api.snsLikeMoment(momentId, momentOwnerUserName);
                resolve({ snsMoment });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsUnlikeMoment: async (momentId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.snsUnlikeMoment(momentId);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsRemoveMomentComment: async (momentId: string, commentId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.snsRemoveMomentComment(momentId, commentId);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsMakeMomentPrivate: async (momentId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.snsMakeMomentPrivate(momentId);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    },
    snsMakeMomentPublic: async (momentId: string): Promise<Object> => {
        return new Promise(async (resolve) => {
            try {
                await client.api.snsMakeMomentPublic(momentId);
                resolve({ "msg": "done" });
            } catch (e) {
                resolve(e);
            }
        })
    }
}

export default PadLocal;