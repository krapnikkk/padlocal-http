import express, { Express, NextFunction, Request, Response } from 'express';
import { Media, PadLocalClientConfig, ServerConfig, SNSMomentType } from './interface';
import cors from "cors";
import { StatusCodes } from 'http-status-codes';
import HttpException from './exceptions/HttpException';
import errorMiddleware from './middleware/errorMiddleware';
import checkLoginMiddleware from './middleware/checkLoginMiddleware';
import PadLocal from './PadLocal';
import MessageHandler from './MessageHandler';

const app: Express = express();
app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST', 'OPTIONS']
}));

process.on('unhandledRejection', (error:Error) => {
    console.log('unhandledRejection', error.message);
  });

app.use(checkLoginMiddleware);
app.use(errorMiddleware);

app.post("/api/login", async (_req: Request, res: Response) => {
    let result = await PadLocal.login();
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/logout", async (_req: Request, res: Response) => {
    let result = await PadLocal.logout();
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_private_msg", async (req: Request, res: Response) => {
    let { id, message } = req.body;
    let result = await PadLocal.sendMessage({ message, id });
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_chatroom_msg", async (req: Request, res: Response) => {
    let { id, message, atUserList } = req.body;
    let result = await PadLocal.sendMessage({ message, id }, atUserList);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/revoke_message", async (req: Request, res: Response) => {
    let { id, msgId, revokeInfo } = req.body;
    let result = await PadLocal.revokeMessage(msgId, id, revokeInfo);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_image", async (req: Request, res: Response) => {
    let { id, file } = req.body;
    let result = await PadLocal.sendMedia(id, file, Media.Image);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_file", async (req: Request, res: Response) => {
    let { id, file } = req.body;
    let result = await PadLocal.sendMedia(id, file, Media.File);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_video", async (req: Request, res: Response) => {
    let { id, file } = req.body;
    let result = await PadLocal.sendMedia(id, file, Media.Video);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_voice", async (req: Request, res: Response) => {
    let { id, file } = req.body;
    let result = await PadLocal.sendMedia(id, file, Media.Audio);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_share_link", async (req: Request, res: Response) => {
    let { id, shareInfo } = req.body;
    let result = await PadLocal.sendAppMessageLink(id, shareInfo);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_share_miniprogram", async (req: Request, res: Response) => {
    let { id, info } = req.body;
    let result = await PadLocal.sendAppMessageMiniProgram(id, info);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/send_contact_card", async (req: Request, res: Response) => {
    let { id, payload } = req.body;
    let result = await PadLocal.sendContactCardMessage(id, payload);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/search_contact", async (req: Request, res: Response) => {
    let { userName } = req.body;
    let result = await PadLocal.searchContact(userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/add_contact", async (req: Request, res: Response) => {
    let { userName, greeting } = req.body;
    let result = await PadLocal.addContact(userName, greeting);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/delete_contact", async (req: Request, res: Response) => {
    let { userName } = req.body;
    let result = await PadLocal.deleteContact(userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/get_contact", async (req: Request, res: Response) => {
    let { userName } = req.body;
    let result = await PadLocal.getContact(userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/get_contact_qrcode", async (_req: Request, res: Response) => {
    let result = await PadLocal.getContactQRCode();
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/accept_contact", async (req: Request, res: Response) => {
    let { stranger, ticket } = req.body;
    let result = await PadLocal.acceptUser(stranger, ticket);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/update_nickname", async (req: Request, res: Response) => {
    let { nickname } = req.body;
    let result = await PadLocal.updateSelfNickName(nickname);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/update_signature", async (req: Request, res: Response) => {
    let { signature } = req.body;
    let result = await PadLocal.updateSelfSignature(signature);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/zombie_test", async (req: Request, res: Response) => {
    let { userName } = req.body;
    let result = await PadLocal.zombieTest(userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/update_contact_remark", async (req: Request, res: Response) => {
    let { userName, remark } = req.body;
    let result = await PadLocal.updateContactRemark(userName, remark);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/create_chatroom", async (req: Request, res: Response) => {
    let { userNameList } = req.body;
    let result = await PadLocal.createChatRoom(userNameList);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/get_chatroom_members", async (req: Request, res: Response) => {
    let { roomId } = req.body;
    let result = await PadLocal.getChatRoomMembers(roomId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/get_chatroom_qrcode", async (req: Request, res: Response) => {
    let { roomId } = req.body;
    let result = await PadLocal.getChatRoomQrCode(roomId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/get_chatroom_member", async (req: Request, res: Response) => {
    let { roomId, userName } = req.body;
    let result = await PadLocal.getChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/set_chatroom_announcement", async (req: Request, res: Response) => {
    let { roomId, announcement } = req.body;
    let result = await PadLocal.setChatRoomAnnouncement(roomId, announcement);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/set_chatroom_name", async (req: Request, res: Response) => {
    let { roomId, roomName } = req.body;
    let result = await PadLocal.setChatRoomName(roomId, roomName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/quit_chatroom", async (req: Request, res: Response) => {
    let { roomId } = req.body;
    let result = await PadLocal.quitChatRoom(roomId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/add_chatroom_member", async (req: Request, res: Response) => {
    let { roomId, userName } = req.body;
    let result = await PadLocal.addChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/delete_chatroom_member", async (req: Request, res: Response) => {
    let { roomId, userName } = req.body;
    let result = await PadLocal.deleteChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/invite_chatroom_member", async (req: Request, res: Response) => {
    let { roomId, userName } = req.body;
    let result = await PadLocal.inviteChatRoomMember(roomId, userName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/get_labelList", async (_req: Request, res: Response) => {
    let result = await PadLocal.getLabelList();
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/add_label", async (req: Request, res: Response) => {
    let { label } = req.body;
    let result = await PadLocal.addLabel(label);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/remove_label", async (req: Request, res: Response) => {
    let { labelId } = req.body;
    let result = await PadLocal.removeLabel(labelId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/set_contact_label", async (req: Request, res: Response) => {
    let { userName, labelList } = req.body;
    let result = await PadLocal.setContactLabel(userName, labelList);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_get_timeline", async (req: Request, res: Response) => {
    let { maxId } = req.body;
    let result = await PadLocal.snsGetTimeline(maxId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_get_moment", async (req: Request, res: Response) => {
    let { momentId } = req.body;
    let result = await PadLocal.snsGetMoment(momentId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_send_text_moment", async (req: Request, res: Response) => {
    let { content, options } = req.body;
    let result = await PadLocal.snsSendMoment(SNSMomentType.Text, content, options);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_send_image_moment", async (req: Request, res: Response) => {
    let { content, options } = req.body;
    let result = await PadLocal.snsSendMoment(SNSMomentType.Image, content, options);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_send_url_moment", async (req: Request, res: Response) => {
    let { content, options } = req.body;
    let result = await PadLocal.snsSendMoment(SNSMomentType.Url, content, options);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_remove_moment", async (req: Request, res: Response) => {
    let { momentId } = req.body;
    let result = await PadLocal.snsRemoveMoment(momentId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_send_comment", async (req: Request, res: Response) => {
    let { momentId, momentOwnerUserName, commentText, replyTo } = req.body;
    let result = await PadLocal.snsSendComment(momentId, momentOwnerUserName, commentText, replyTo);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_like_moment", async (req: Request, res: Response) => {
    let { momentId, momentOwnerUserName } = req.body;
    let result = await PadLocal.snsLikeMoment(momentId, momentOwnerUserName);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_unlike_moment", async (req: Request, res: Response) => {
    let { momentId } = req.body;
    let result = await PadLocal.snsUnlikeMoment(momentId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_remove_moment_comment", async (req: Request, res: Response) => {
    let { momentId, commentId } = req.body;
    let result = await PadLocal.snsRemoveMomentComment(momentId, commentId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_make_moment_private", async (req: Request, res: Response) => {
    let { momentId } = req.body;
    let result = await PadLocal.snsMakeMomentPrivate(momentId);
    res.json({
        result: result,
        success: true
    });
});

app.post("/api/sns_make_moment_public", async (req: Request, res: Response) => {
    let { momentId } = req.body;
    let result = await PadLocal.snsMakeMomentPublic(momentId);
    res.json({
        result: result,
        success: true
    });
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
    const error: HttpException = new HttpException(StatusCodes.NOT_FOUND, "Router Not Found");
    next(error);
});

export const install = (robotConfig: PadLocalClientConfig, serverConfig: ServerConfig) => {
    let { postUrl, port } = serverConfig;
    PadLocal.install(robotConfig);
    MessageHandler.postUrl = postUrl;
    app.listen(port, async () => {
        console.log('running on http://127.0.0.1:' + serverConfig.port);
    });
}

export const login = () => {
    PadLocal.login();
}








