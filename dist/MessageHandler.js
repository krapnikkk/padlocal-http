"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const MessageHandler = {
    postUrl: "",
    post: (message) => {
        if (MessageHandler.postUrl) {
            utils_1.post(MessageHandler.postUrl, message);
        }
    }
};
exports.default = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map