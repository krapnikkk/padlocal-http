"use strict";
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
exports.logout = exports.install = void 0;
const express_1 = __importDefault(require("express"));
const interface_1 = require("./interface");
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = require("http-status-codes");
const HttpException_1 = __importDefault(require("./exceptions/HttpException"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const checkLoginMiddleware_1 = __importDefault(require("./middleware/checkLoginMiddleware"));
const PadLocal_1 = __importDefault(require("./PadLocal"));
const MessageHandler_1 = __importDefault(require("./MessageHandler"));
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default({
    methods: ['GET', 'POST', 'OPTIONS']
}));
process.on('unhandledRejection', (error) => {
    console.log('unhandledRejection', error);
});
app.use(checkLoginMiddleware_1.default);
app.use(errorMiddleware_1.default);
app.post("/api/login", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield PadLocal_1.default.login();
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/logout", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield PadLocal_1.default.logout();
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_private_msg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, message } = req.body;
    let result = yield PadLocal_1.default.sendMessage({ message, id });
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_chatroom_msg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, message, atUserList } = req.body;
    let result = yield PadLocal_1.default.sendMessage({ message, id }, atUserList);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/revoke_message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, msgId, revokeInfo } = req.body;
    let result = yield PadLocal_1.default.revokeMessage(msgId, id, revokeInfo);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_image", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, file } = req.body;
    let result = yield PadLocal_1.default.sendMedia(id, file, interface_1.Media.Image);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_file", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, file } = req.body;
    let result = yield PadLocal_1.default.sendMedia(id, file, interface_1.Media.File);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_video", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, file } = req.body;
    let result = yield PadLocal_1.default.sendMedia(id, file, interface_1.Media.Video);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_voice", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, file } = req.body;
    let result = yield PadLocal_1.default.sendMedia(id, file, interface_1.Media.Audio);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_share_link", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, shareInfo } = req.body;
    let result = yield PadLocal_1.default.sendAppMessageLink(id, shareInfo);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_share_miniprogram", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, info } = req.body;
    let result = yield PadLocal_1.default.sendAppMessageMiniProgram(id, info);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/send_contact_card", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, payload } = req.body;
    let result = yield PadLocal_1.default.sendContactCardMessage(id, payload);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/search_contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userName } = req.body;
    let result = yield PadLocal_1.default.searchContact(userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/add_contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userName, greeting } = req.body;
    let result = yield PadLocal_1.default.addContact(userName, greeting);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/delete_contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userName } = req.body;
    let result = yield PadLocal_1.default.deleteContact(userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/get_contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userName } = req.body;
    let result = yield PadLocal_1.default.getContact(userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/get_contact_qrcode", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield PadLocal_1.default.getContactQRCode();
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/accept_contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { stranger, ticket } = req.body;
    let result = yield PadLocal_1.default.acceptUser(stranger, ticket);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/update_nickname", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { nickname } = req.body;
    let result = yield PadLocal_1.default.updateSelfNickName(nickname);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/update_signature", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { signature } = req.body;
    let result = yield PadLocal_1.default.updateSelfSignature(signature);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/zombie_test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userName } = req.body;
    let result = yield PadLocal_1.default.zombieTest(userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/update_contact_remark", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userName, remark } = req.body;
    let result = yield PadLocal_1.default.updateContactRemark(userName, remark);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/create_chatroom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userNameList } = req.body;
    let result = yield PadLocal_1.default.createChatRoom(userNameList);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/get_chatroom_members", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId } = req.body;
    let result = yield PadLocal_1.default.getChatRoomMembers(roomId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/get_chatroom_qrcode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId } = req.body;
    let result = yield PadLocal_1.default.getChatRoomQrCode(roomId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/get_chatroom_member", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId, userName } = req.body;
    let result = yield PadLocal_1.default.getChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/set_chatroom_announcement", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId, announcement } = req.body;
    let result = yield PadLocal_1.default.setChatRoomAnnouncement(roomId, announcement);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/set_chatroom_name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId, roomName } = req.body;
    let result = yield PadLocal_1.default.setChatRoomName(roomId, roomName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/quit_chatroom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId } = req.body;
    let result = yield PadLocal_1.default.quitChatRoom(roomId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/add_chatroom_member", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId, userName } = req.body;
    let result = yield PadLocal_1.default.addChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/delete_chatroom_member", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId, userName } = req.body;
    let result = yield PadLocal_1.default.deleteChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/invite_chatroom_member", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { roomId, userName } = req.body;
    let result = yield PadLocal_1.default.inviteChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/get_labelList", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield PadLocal_1.default.getLabelList();
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/add_label", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { label } = req.body;
    let result = yield PadLocal_1.default.addLabel(label);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/remove_label", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { labelId } = req.body;
    let result = yield PadLocal_1.default.removeLabel(labelId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/set_contact_label", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userName, labelList } = req.body;
    let result = yield PadLocal_1.default.setContactLabel(userName, labelList);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_get_timeline", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { maxId } = req.body;
    let result = yield PadLocal_1.default.snsGetTimeline(maxId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_get_user_timeline", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { maxId, userId } = req.body;
    let result = yield PadLocal_1.default.snsGetUserTimeline(maxId, userId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_get_moment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId } = req.body;
    let result = yield PadLocal_1.default.snsGetMoment(momentId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_send_text_moment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { content, options } = req.body;
    let result = yield PadLocal_1.default.snsSendMoment(interface_1.SNSMomentType.Text, content, options);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_send_image_moment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { content, options } = req.body;
    let result = yield PadLocal_1.default.snsSendMoment(interface_1.SNSMomentType.Image, content, options);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_send_url_moment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { content, options } = req.body;
    let result = yield PadLocal_1.default.snsSendMoment(interface_1.SNSMomentType.Url, content, options);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_remove_moment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId } = req.body;
    let result = yield PadLocal_1.default.snsRemoveMoment(momentId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_send_comment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId, momentOwnerUserName, commentText, replyTo } = req.body;
    let result = yield PadLocal_1.default.snsSendComment(momentId, momentOwnerUserName, commentText, replyTo);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_like_moment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId, momentOwnerUserName } = req.body;
    let result = yield PadLocal_1.default.snsLikeMoment(momentId, momentOwnerUserName);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_unlike_moment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId } = req.body;
    let result = yield PadLocal_1.default.snsUnlikeMoment(momentId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_remove_moment_comment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId, commentId } = req.body;
    let result = yield PadLocal_1.default.snsRemoveMomentComment(momentId, commentId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_make_moment_private", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId } = req.body;
    let result = yield PadLocal_1.default.snsMakeMomentPrivate(momentId);
    res.json({
        result: result,
        success: true
    });
}));
app.post("/api/sns_make_moment_public", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { momentId } = req.body;
    let result = yield PadLocal_1.default.snsMakeMomentPublic(momentId);
    res.json({
        result: result,
        success: true
    });
}));
app.use((req, _res, next) => {
    const error = new HttpException_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Router Not Found");
    let originalUrl = req.originalUrl;
    console.log(originalUrl);
    next(error);
});
exports.install = (robotConfig, serverConfig) => __awaiter(void 0, void 0, void 0, function* () {
    let { postUrl, port } = serverConfig;
    yield PadLocal_1.default.install(robotConfig);
    MessageHandler_1.default.postUrl = postUrl;
    app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Padlocal-http listen on http://127.0.0.1:' + serverConfig.port);
        console.log(`Post url :${postUrl}`);
    }));
    PadLocal_1.default.login();
});
exports.logout = () => {
    PadLocal_1.default.logout();
};
//# sourceMappingURL=PadLocalHTTP.js.map