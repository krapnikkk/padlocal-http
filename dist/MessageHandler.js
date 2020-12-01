"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const MessageHandler = {
    postUrl: "",
    post: (message) => {
        if (MessageHandler.postUrl) {
            axios_1.default.post(MessageHandler.postUrl, message)
                .then(() => {
            }).catch((e) => {
                console.log(e.message);
            });
        }
    }
};
exports.default = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map