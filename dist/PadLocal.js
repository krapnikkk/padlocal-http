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
const interface_1 = require("./interface");
const fs_1 = __importDefault(require("fs"));
const music_metadata_1 = require("music-metadata");
const pb = __importStar(require("padlocal-client-ts/dist/proto/padlocal_pb"));
const utils_1 = require("./utils");
let client;
const PadLocal = {
    isLogin: false,
    messageHandler: null,
    install: (config) => {
        try {
            let { serverHost, serverPort, token, serverCAFilePath } = config;
            client = new padlocal_client_ts_1.PadLocalClient(`${serverHost}:${serverPort}`, token, serverCAFilePath);
        }
        catch (e) {
            console.warn(e);
        }
    },
    login: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            yield client.api.login(padlocal_pb_1.LoginPolicy.DEFAULT, {
                onLoginStart: (loginType) => {
                    console.log("start login with type: ", loginType);
                },
                onOneClickEvent: (oneClickEvent) => {
                    const oneClickEventObject = oneClickEvent.toObject();
                    console.log("on one click event: ", JSON.stringify(oneClickEventObject));
                    if (oneClickEventObject.status == 1) {
                        resolve(JSON.stringify(oneClickEventObject));
                    }
                },
                onQrCodeEvent: (qrCodeEvent) => {
                    console.log("on qr code event: ", JSON.stringify(qrCodeEvent.toObject()));
                    resolve("on qr code event: " + JSON.stringify(qrCodeEvent.toObject()));
                },
                onLoginSuccess(contact) {
                    PadLocal.isLogin = true;
                    console.log("on login success: ", JSON.stringify(contact.toObject()));
                    resolve("on login success: " + JSON.stringify(contact.toObject()));
                },
                onSync: (_syncEvent) => {
                    for (const contact of _syncEvent.getContactList()) {
                        console.log("login on sync contact: ", JSON.stringify(contact.toObject()));
                    }
                    for (const message of _syncEvent.getMessageList()) {
                        console.log("login on sync message: ", JSON.stringify(message.toObject()));
                    }
                }
            }).catch(e => {
                reject(e);
            });
            client.on("message", (messageList) => {
                for (const message of messageList) {
                    console.log("on message: ", JSON.stringify(message.toObject()));
                    if (message.getType() == 1) {
                    }
                    else if (message.getType() == 51) {
                    }
                }
            });
            client.on("contact", (contactList) => {
                for (const contact of contactList) {
                    console.log("on contact: ", JSON.stringify(contact.toObject()));
                }
            });
            client.on("error", (e) => {
                console.log("error:", e);
            });
        }));
    }),
    logout: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            if (client) {
                const response = yield client.api.logout();
                PadLocal.isLogin = false;
                resolve(response);
            }
        }));
    }),
    sendMessage: (msg) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { id, message } = msg;
                let idempotentId = Utils_1.genIdempotentId();
                const response = yield client.api.sendTextMessage(idempotentId, id, message);
                resolve(response.toObject());
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
                let response;
                switch (type) {
                    case interface_1.Media.Video:
                        response = yield client.api.sendVideoMessage(Utils_1.genIdempotentId(), id, fileData);
                        break;
                    case interface_1.Media.Image:
                        response = yield client.api.sendImageMessage(Utils_1.genIdempotentId(), id, fileData);
                        break;
                    case interface_1.Media.Audio:
                        const audioMetadata = yield music_metadata_1.parseBuffer(fileData);
                        const duration = audioMetadata.format.duration;
                        const milliSeconds = utils_1.secondsToMilliSeconds(duration);
                        response = yield client.api.sendVoiceMessage(Utils_1.genIdempotentId(), id, fileData, milliSeconds);
                        break;
                    default:
                        const fileName = file.split("/").pop();
                        response = yield client.api.sendFileMessage(Utils_1.genIdempotentId(), id, fileData, fileName);
                        break;
                }
                resolve(response.toObject());
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
                const response = yield client.api.sendAppMessageLink(Utils_1.genIdempotentId(), id, new pb.AppMessageLink()
                    .setTitle(title)
                    .setDescription(desc)
                    .setUrl(url)
                    .setThumburl(thumburl));
                resolve({ "msgId": response });
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
                const response = yield client.api.sendAppMessageMiniProgram(Utils_1.genIdempotentId(), id, new pb.AppMessageMiniProgram()
                    .setTitle(title)
                    .setDescription(desc)
                    .setUrl(url)
                    .setMpappusername(mpappusername)
                    .setMpappname(mpappname)
                    .setMpappid(mpappid)
                    .setMpappiconurl(appiconurl)
                    .setMpapppath("pages/home/index.html?utm_medium=userid_123456")
                    .setThumbimage(thumbImageData));
                resolve({ "msgId": response });
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
                const response = yield client.api.sendContactCardMessage(Utils_1.genIdempotentId(), id, contact);
                resolve(response);
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    addContact: (userName, greeting) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const searchRes = yield client.api.searchContact(userName);
                const contact = Utils_1.stringifyPB(searchRes);
                console.log(`search contact: ${contact}`);
                yield client.api.addContact(searchRes.getContact().getUsername(), searchRes.getAntispamticket(), pb.AddContactScene.WECHAT_ID, greeting);
                resolve(contact);
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
                resolve("done");
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
                resolve(contact);
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getContactQRCode: (userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const contact = yield client.api.getContact(userName);
                const contactName = contact.getUsername();
                const response = yield client.api.getContactQRCode(contactName, 2);
                const qrcode = "data:image/png;base64," + response.getQrcode_asB64();
                resolve(qrcode);
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
                resolve(contact);
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
                resolve("done");
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
                resolve("done");
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
                resolve(status);
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
                resolve("done");
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
                const response = yield client.api.createChatRoom(id, userNameList);
                resolve(response);
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
                const response = Utils_1.stringifyPB(memberList);
                resolve(response);
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
                resolve(qrcode);
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getChatRoomMember: (roomId, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const member = yield client.api.getChatRoomMember(roomId, userName);
                const response = Utils_1.stringifyPB(member);
                resolve(response);
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
                resolve("done");
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
                resolve("done");
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    addChatRoomMember: (roomId, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.addChatRoomMember(roomId, userName);
                resolve("done");
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
                resolve("done");
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    inviteChatRoomMember: (roomId, userName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.inviteChatRoomMember(roomId, userName);
                resolve("done");
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
                resolve("done");
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    getLabelList: () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield client.api.getLabelList();
                resolve(response);
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
                resolve("done");
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
                resolve("done");
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsGetTimeline: (maxId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const momentList = yield client.api.snsGetTimeline(maxId);
                const response = Utils_1.stringifyPB(momentList);
                resolve(response);
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsGetMoment: (momentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const moment = yield client.api.snsGetMoment(momentId);
                const response = Utils_1.stringifyPB(moment);
                resolve(response);
            }
            catch (e) {
                resolve(e);
            }
        }));
    }),
    snsSendMoment: (type, content, options) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let response, moment;
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
                        moment = yield client.api.snsSendMoment(id, textMoment, snsSendMomentOptions);
                        break;
                    case interface_1.SNSMomentType.Image:
                        let { imageFilePathList, description } = content;
                        const imageMoment = new pb.SnsSendMomentImages().setText(description);
                        const imageUrlList = yield PadLocal.uploadImages(imageFilePathList);
                        imageMoment.setImageurlList(imageUrlList);
                        moment = yield client.api.snsSendMoment(id, imageMoment, snsSendMomentOptions);
                        break;
                    case interface_1.SNSMomentType.Url:
                        let { url, title, thumburl, desc } = content;
                        const urlMoment = new pb.SnsSendMomentUrl().setText(desc);
                        const coverImageUrlList = yield PadLocal.uploadImages([thumburl]);
                        urlMoment.setImageurl(coverImageUrlList[0]).setUrl(url).setUrltitle(title);
                        moment = yield client.api.snsSendMoment(id, urlMoment, snsSendMomentOptions);
                        break;
                    default:
                        moment = yield client.api.snsSendMoment(id, new pb.SnsSendMomentText().setText(content), snsSendMomentOptions);
                        break;
                }
                response = Utils_1.stringifyPB(moment);
                resolve(response);
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
            console.log(`upload image response: ${Utils_1.stringifyPB(imageUploadRes)}`);
            ret.push(imageUploadRes.getUrl());
        }
        return ret;
    }),
    snsRemoveMoment: (momentId) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.api.snsRemoveMoment(momentId);
                resolve("done");
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
                const response = yield client.api.snsSendComment(id, momentId, momentOwnerUserName, commentText, snsSendCommentReplyTo);
                resolve(response);
            }
            catch (e) {
                console.log(e);
                resolve(e);
            }
        }));
    }),
    snsLikeMoment: (momentId, momentOwnerUserName) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const snsMoment = yield client.api.snsLikeMoment(momentId, momentOwnerUserName);
                const response = Utils_1.stringifyPB(snsMoment);
                resolve(response);
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
                resolve("done");
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
                resolve("done");
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
                resolve("done");
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
                resolve("done");
            }
            catch (e) {
                resolve(e);
            }
        }));
    })
};
exports.default = PadLocal;
//# sourceMappingURL=PadLocal.js.map