export default class HttpException extends Error {
    status: number;
    message: string;
    errors?: any;
    constructor(status: number, message: string, errors?: any);
}
