import express from "express";

interface ResponseError extends Error {
    status?: number
};

export const sendError = (status: number, message: string, next: express.NextFunction) => {
    const error = new Error(message) as ResponseError;
    error.status = status;
    next(error);
};

const errorHandler = (error: ResponseError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(error.status || 500).json({ success: false, error: error.message });
};

export default errorHandler;