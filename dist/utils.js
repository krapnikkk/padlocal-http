"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = exports.secondsToMilliSeconds = void 0;
const http_1 = __importDefault(require("http"));
exports.secondsToMilliSeconds = (seconds) => {
    return Math.round(1000 * seconds);
    ;
};
exports.post = (url, postData, options) => {
    return new Promise((resolve) => {
        let flag = false;
        try {
            let req = http_1.default.request(url, options, (res) => {
                let chunks = [];
                res.on("data", (chunk) => {
                    chunks.push(chunk);
                    flag = true;
                    resolve(flag);
                });
                res.on("end", () => {
                });
                res.on("error", function (error) {
                    console.log(error);
                    resolve(flag);
                });
            });
            req.write(postData);
            req.end();
        }
        catch (e) {
            resolve(flag);
        }
    });
};
//# sourceMappingURL=utils.js.map