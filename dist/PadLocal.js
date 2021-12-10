"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const padlocal_client_ts_1 = require("padlocal-client-ts");
const padlocal_pb_1 = require("padlocal-client-ts/dist/proto/padlocal_pb");
const Utils_1 = require("padlocal-client-ts/dist/utils/Utils");
const pb = __importStar(require("padlocal-client-ts/dist/proto/padlocal_pb"));
const interface_1 = require("./interface");
const fs_1 = __importDefault(require("fs"));
const music_metadata_1 = require("music-metadata");
const utils_1 = require("./utils");
const MessageHandler_1 = __importDefault(require("./MessageHandler"));
let client;
const PadLocal = {
    isLogin: false,
    contactList: [],
    install: (config) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { token } = config;
            client = yield padlocal_client_ts_1.PadLocalClient.create(token);
        }
        catch (e) {
            console.warn(e);
        }
    }),
    login: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            if (!client) {
                resolve("install first");
            }
            yield client.api.login(padlocal_pb_1.LoginPolicy.DEFAULT, {
                onLoginStart: (loginType) => {
                    console.log("start login with type: ", loginType);
                },
                onOneClickEvent: (qrCodeEvent) => {
                    let response = qrCodeEvent.toObject();
                    console.log("on one click event: ", JSON.stringify(response));
                    if (response.status == 1) {
                        resolve({ response });
                    }
                },
                onQrCodeEvent: (qrCodeEvent) => {
                    let response = qrCodeEvent.toObject();
                    console.log("on qr code event: ", JSON.stringify(qrCodeEvent.toObject()));
                    resolve({ response });
                },
                onLoginSuccess(contact) {
                    client.on("message", (messageList) => {
                        for (const message of messageList) {
                            console.log("on message: ", JSON.stringify(message.toObject()));
                            MessageHandler_1.default.post(message.toObject());
                        }
                    });
                    PadLocal.isLogin = true;
                    let response = contact.toObject();
                    resolve({ response });
                },
                onSync: (_syncEvent) => {
                }
            }).catch(e => {
                reject(e);
            });
            client.on("error", (e) => {
                console.log("error:", e);
            });
        }));
    }),
    logout: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            if (client) {
                const logoutResponse = yield client.api.logout();
                PadLocal.isLogin = false;
                let response = logoutResponse.toObject();
                resolve({ response });
            }
        }));
    }),
    sendMessage: (msg, atUserList = []) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { id, message } = msg;
                let idempotentId = Utils_1.genIdempotentId();
                let sendTextMessageResponse = yield client.api.sendTextMessage(idempotentId, id, message, atUserList);
                let response = sendTextMessageResponse.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    revokeMessage: (msgId, toUserName, revokeInfo) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { clientMsgId, newClientMsgId, createTime } = revokeInfo;
                const fromUserName = yield client.selfContact.getUsername();
                yield client.api.revokeMessage(msgId, fromUserName, toUserName, new padlocal_pb_1.MessageRevokeInfo().setClientmsgid(clientMsgId).setNewclientmsgid(newClientMsgId).setCreatetime(createTime));
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    sendMedia: (id, file, type) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const fileData = fs_1.default.readFileSync(file);
                let sendVideoMessageResponse;
                switch (type) {
                    case interface_1.Media.Video:
                        sendVideoMessageResponse = yield client.api.sendVideoMessage(Utils_1.genIdempotentId(), id, fileData);
                        break;
                    case interface_1.Media.Image:
                        sendVideoMessageResponse = yield client.api.sendImageMessage(Utils_1.genIdempotentId(), id, fileData);
                        break;
                    case interface_1.Media.Audio:
                        const audioMetadata = yield music_metadata_1.parseBuffer(fileData);
                        const duration = audioMetadata.format.duration;
                        const milliSeconds = utils_1.secondsToMilliSeconds(duration);
                        sendVideoMessageResponse = yield client.api.sendVoiceMessage(Utils_1.genIdempotentId(), id, fileData, milliSeconds);
                        break;
                    default:
                        const fileName = file.split("/").pop();
                        sendVideoMessageResponse = yield client.api.sendFileMessage(Utils_1.genIdempotentId(), id, fileData, fileName);
                        break;
                }
                let response = sendVideoMessageResponse.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    sendAppMessageLink: (id, info) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { title, desc, url, thumburl } = info;
                const msgId = yield client.api.sendMessageLink(Utils_1.genIdempotentId(), id, new pb.AppMessageLink()
                    .setTitle(title)
                    .setDescription(desc)
                    .setUrl(url)
                    .setThumburl(thumburl));
                resolve({ msgId });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    sendAppMessageMiniProgram: (id, info) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { title, desc, url, mpThumbFilePath, mpappusername, mpappname, mpappid, appiconurl } = info;
                const thumbImageData = fs_1.default.readFileSync(mpThumbFilePath);
                const msgId = yield client.api.sendMessageMiniProgram(Utils_1.genIdempotentId(), id, new pb.AppMessageMiniProgram()
                    .setTitle(title)
                    .setDescription(desc)
                    .setUrl(url)
                    .setMpappusername(mpappusername)
                    .setMpappname(mpappname)
                    .setMpappid(mpappid)
                    .setMpappiconurl(appiconurl)
                    .setMpapppath("pages/home/index.html?utm_medium=userid_123456")
                    .setThumbimage(thumbImageData), thumbImageData);
                resolve({ msgId });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    sendContactCardMessage: (id, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const searchRes = yield client.api.searchContact(userName);
                const contact = searchRes.getContact();
                const sendContactCardMessageResponse = yield client.api.sendContactCardMessage(Utils_1.genIdempotentId(), id, contact);
                let response = sendContactCardMessageResponse.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    syncContact: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.syncContact(PadLocal);
                resolve(PadLocal.contactList);
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    onSync: (contactList) => {
        PadLocal.contactList = contactList.map((contact) => {
            return contact.toObject();
        });
    },
    addContact: (userName, greeting) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield client.api.searchContact(userName);
                yield client.api.addContact(response.getContact().getUsername(), response.getAntispamticket(), pb.AddContactScene.WECHAT_ID, greeting);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    deleteContact: (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.deleteContact(userName);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getContact: (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const contact = yield client.api.getContact(userName);
                let response = contact.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getContactQRCode: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const contactName = yield client.selfContact.getUsername();
                const response = yield client.api.getContactQRCode(contactName, 2);
                const qrcode = "data:image/png;base64," + response.getQrcode_asB64();
                resolve({ qrcode });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    acceptUser: (userName, stranger, ticket, scene) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.acceptUser(userName, stranger, ticket, scene);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    searchContact: (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const contact = yield client.api.searchContact(userName);
                let response = contact.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    updateSelfNickName: (nickname) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.updateSelfNickName(nickname);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    updateSelfSignature: (signature) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.updateSelfSignature(signature);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    zombieTest: (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const status = yield client.api.zombieTest(userName);
                resolve({ status });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    updateContactRemark: (userName, remark) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.updateContactRemark(userName, remark);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    createChatRoom: (userNameList) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = Utils_1.genIdempotentId();
                const chatroom = yield client.api.createChatRoom(id, userNameList);
                let response = chatroom.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getChatRoomMembers: (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const memberList = yield client.api.getChatRoomMembers(roomId);
                let response = memberList.map((menber) => {
                    return menber.toObject();
                });
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getChatRoomQrCode: (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield client.api.getChatRoomQrCode(roomId);
                const qrcode = "data:image/png;base64," + response.getQrcode_asB64();
                resolve({ qrcode });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getChatRoomMember: (roomId, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const contact = yield client.api.getChatRoomMember(roomId, userName);
                let response = contact.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    setChatRoomAnnouncement: (roomId, announcement) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.setChatRoomAnnouncement(roomId, announcement);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    setChatRoomName: (roomId, roomName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.setChatRoomName(roomId, roomName);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    addChatRoomMember: (roomId, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let status = yield client.api.addChatRoomMember(roomId, userName);
                resolve({ status, "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    deleteChatRoomMember: (roomId, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.deleteChatRoomMember(roomId, userName);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    inviteChatRoomMember: (roomId, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let status = yield client.api.addChatRoomMember(roomId, userName);
                resolve({ status, "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    quitChatRoom: (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.quitChatRoom(roomId);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getLabelList: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const labelList = yield client.api.getLabelList();
                resolve({ labelList });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    addLabel: (label) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const labelId = yield client.api.addLabel(label);
                resolve({ labelId });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    removeLabel: (labelId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.removeLabel(labelId);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    setContactLabel: (userName, labelList) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.setContactLabel(userName, labelList);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsGetTimeline: (maxId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let momentList = yield client.api.snsGetTimeline(maxId);
                let response = momentList.map((moment) => {
                    return moment.toObject();
                });
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsGetUserTimeline: (maxId, userId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let momentList = yield client.api.snsGetUserPage(userId, maxId);
                let response = momentList.map((moment) => {
                    return moment.toObject();
                });
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsGetMoment: (momentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const snsMoment = yield client.api.snsGetMoment(momentId);
                resolve(snsMoment.toObject());
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsSendMoment: (type, content, options) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let snsMoment;
                const id = Utils_1.genIdempotentId();
                const { isPrivate, cannotseeusernameList, canseeusernameList, atusernameList } = options;
                const snsSendMomentOptions = new pb.SnsSendMomentOptions();
                if (isPrivate) {
                    snsSendMomentOptions.setIsprivate(isPrivate);
                }
                else if (cannotseeusernameList && cannotseeusernameList.length > 1) {
                    snsSendMomentOptions.setCannotseeusernameList(cannotseeusernameList);
                }
                else if (canseeusernameList && canseeusernameList.length > 1) {
                    snsSendMomentOptions.setCanseeusernameList(canseeusernameList);
                }
                if (atusernameList && atusernameList.length > 1) {
                    snsSendMomentOptions.setAtusernameList(atusernameList);
                }
                switch (type) {
                    case interface_1.SNSMomentType.Text:
                        const textMoment = new pb.SnsSendMomentText().setText(content);
                        snsMoment = yield client.api.snsSendMoment(id, textMoment, snsSendMomentOptions);
                        break;
                    case interface_1.SNSMomentType.Image:
                        let { imageFilePathList, description } = content;
                        const imageMoment = new pb.SnsSendMomentImages().setText(description);
                        const imageUrlList = yield PadLocal.uploadImages(imageFilePathList);
                        imageMoment.setImageurlList(imageUrlList);
                        snsMoment = yield client.api.snsSendMoment(id, imageMoment, snsSendMomentOptions);
                        break;
                    case interface_1.SNSMomentType.Url:
                        let { url, title, thumburl, desc } = content;
                        const urlMoment = new pb.SnsSendMomentUrl().setText(desc);
                        const coverImageUrlList = yield PadLocal.uploadImages([thumburl]);
                        urlMoment.setImageurl(coverImageUrlList[0]).setUrl(url).setUrltitle(title);
                        snsMoment = yield client.api.snsSendMoment(id, urlMoment, snsSendMomentOptions);
                        break;
                    default:
                        snsMoment = yield client.api.snsSendMoment(id, new pb.SnsSendMomentText().setText(content), snsSendMomentOptions);
                        break;
                }
                let response = snsMoment.toObject();
                resolve({ response });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    uploadImages: (imageFilePathList, description) => __awaiter(void 0, void 0, void 0, function* () {
        const ret = [];
        for (let i = 0; i < imageFilePathList.length; ++i) {
            const imageData = fs_1.default.readFileSync(imageFilePathList[i]);
            const des = i === 0 ? description : undefined;
            const imageUploadRes = yield client.api.snsUploadImage(imageData, des);
            ret.push(imageUploadRes.getUrl());
        }
        return ret;
    }),
    snsRemoveMoment: (momentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.snsRemoveMoment(momentId);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsSendComment: (momentId, momentOwnerUserName, commentText, replyTo) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let id = Utils_1.genIdempotentId();
                let snsSendCommentReplyTo = new pb.SnsSendCommentReplyTo();
                if (replyTo) {
                    let { replyCommentId, replyCommentNickName, replyCommentUsername } = replyTo;
                    snsSendCommentReplyTo.setCommentid(replyCommentId)
                        .setCommentnickname(replyCommentNickName)
                        .setCommentusername(replyCommentUsername);
                }
                const snsMoment = yield client.api.snsSendComment(id, momentId, momentOwnerUserName, commentText, snsSendCommentReplyTo);
                resolve({ snsMoment });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsLikeMoment: (momentId, momentOwnerUserName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const snsMoment = yield client.api.snsLikeMoment(momentId, momentOwnerUserName);
                resolve({ snsMoment });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsUnlikeMoment: (momentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.snsUnlikeMoment(momentId);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsRemoveMomentComment: (momentId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.snsRemoveMomentComment(momentId, commentId);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsMakeMomentPrivate: (momentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.snsMakeMomentPrivate(momentId);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsMakeMomentPublic: (momentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.snsMakeMomentPublic(momentId);
                resolve({ "msg": "done" });
            }
            catch (e) {
                resolve(e);
            }
        }));
    })
};
exports.default = PadLocal;
//# sourceMappingURL=PadLocal.js.map