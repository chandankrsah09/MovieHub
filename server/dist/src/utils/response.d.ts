import { Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export declare const sendSuccess: <T>(res: Response, message: string, data?: T, statusCode?: number) => void;
export declare const sendError: (res: Response, message: string, statusCode?: number) => void;
export declare const sendPaginatedResponse: <T>(res: Response, message: string, data: T[], page: number, limit: number, total: number) => void;
//# sourceMappingURL=response.d.ts.map