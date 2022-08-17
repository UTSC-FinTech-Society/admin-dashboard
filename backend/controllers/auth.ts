import express from "express";
import asyncHandler from "express-async-handler";
import { sendError } from "../middleware/error";
import passport from "passport";

const loginAdmin = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { username, password } = req.body as { username: string, password: string };

    passport.authenticate('local', (error, admin: { admin_id: number, username: string, name: string, position: string, profile_pic_type?: string, profile_pic_data?: ArrayBuffer , last_login: Date, status: string }, info: { message: string }) => {
        if (error) return next(error);

        if (admin) {
            req.logIn(admin, error => {
                if (error) return next(error);

                res.status(200).json({ success: true, message: 'Login Successful' });
            });
        } else {
            res.status(401).json({ success: false, error: info.message });
        }
    })(req, res, next);
});

const logoutAdmin = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => { 

    req.logOut(error => {
        if (error) sendError(400, 'Logout Failure', next);
        res.status(200).json({ success: true, message: 'Logout Successful' });
    });

});

export { loginAdmin, logoutAdmin };
