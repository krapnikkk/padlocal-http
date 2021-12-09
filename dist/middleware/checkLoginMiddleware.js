"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PadLocal_1 = __importDefault(require("../PadLocal"));
const checkLoginMiddleware = (req, res, next) => {
    let originalUrl = req.originalUrl;
    if (originalUrl.includes("/api/") && !originalUrl.includes("login") && !originalUrl.includes("logout") && !PadLocal_1.default.isLogin) {
        res.json({
            result: "login first!",
            success: true
        });
    }
    else {
        next();
    }
};
exports.default = checkLoginMiddleware;
//# sourceMappingURL=checkLoginMiddleware.js.map