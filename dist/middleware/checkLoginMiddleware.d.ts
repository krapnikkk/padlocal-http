import { Request, Response, NextFunction } from "express";
declare const checkLoginMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default checkLoginMiddleware;
