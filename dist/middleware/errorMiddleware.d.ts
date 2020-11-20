import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
declare const errorMiddleware: (error: HttpException, _request: Request, response: Response, next: NextFunction) => void;
export default errorMiddleware;
