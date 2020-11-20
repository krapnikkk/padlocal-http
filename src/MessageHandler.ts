import { post } from "./utils"

const MessageHandler = {
    postUrl: "",
    post: (message: any) => {
        if (MessageHandler.postUrl) {
            post(MessageHandler.postUrl, message);
        }
    }
}

export default MessageHandler;