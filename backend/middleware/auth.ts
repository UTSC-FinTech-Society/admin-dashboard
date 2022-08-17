import express from "express";
import { sendError } from "./error";

const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (req.isAuthenticated()) {
        return next();
    }

    sendError(401, 'Not authorized to access this route', next);
};

export default isAuthenticated;