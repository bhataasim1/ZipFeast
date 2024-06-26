import { NextFunction, Request, Response } from 'express';

export type ServerErrorResponse = {
    message: string;
    errors?: Record<string, string[]>;
};

export function sendApiResponseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const originalSend = res.send;
    // Override the res.send method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.send = (apiResponse: any) => {
        if (apiResponse instanceof ApiResponse) {
            res.status(apiResponse.statusCode).json(apiResponse.body);
        } else {
            // If not an ApiResponse, just proceed with the default send
            return originalSend.call(res, apiResponse);
        }
    };

    next();
}

export class ApiResponse {
    constructor(
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        public body: any,
        public statusCode = 200,
        public errors?: Record<string, string[]>
    ) {
        // If the body is an instance of ApiResponse, set the status and send the actual body
        if (statusCode === 200 || statusCode === 201) {
            this.body = body;
        } else {
            this.body = {
                message: body,
                errors: errors,
            } as ServerErrorResponse;
        }
    }
}

// send(res: Response) {
//   return res.status(this.statusCode).json(this.body);
// }
