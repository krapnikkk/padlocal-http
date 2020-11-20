import { Request, Response, NextFunction } from "express";
import PadLocal from "../PadLocal";

const checkLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let originalUrl = req.originalUrl;
    if (originalUrl.includes("/api/") && !originalUrl.includes("login") && !PadLocal.isLogin) {
        res.json({
            result: "login first!",
            success: true
        });
    } else {
        next();
    }
}

export default checkLoginMiddleware;