import express from "express";
import asyncHandler from "express-async-handler";
import Admin from "../models/Admin";
import { sendError } from "../middleware/error";

declare global {
    namespace Express {
      interface User {
        admin_id: number,
        username: string,
        name: string,
        position: string,
        profile_pic_type?: string,
        profile_pic_data?: ArrayBuffer,
        last_login: Date | undefined,
        status: string
      }
    }
}

const getMe = asyncHandler(async (req: express.Request, res: express.Response) => {
    const admin_id = req.user!.admin_id;

    const admin = await Admin.findByPk(admin_id);

    res.status(200).json({ success: true, admin });
});

const getAdmins = asyncHandler(async (req: express.Request, res: express.Response) => {
    const admins = await Admin.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json({ success: true, admins: admins });
});

const createNewAdmin = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { username, password, name, position } = req.body as { username: string, password: string, name: string, position: string };
    const profile_pic_type = req.file?.mimetype as string | undefined;
    const profile_pic_data = req.file?.buffer as ArrayBuffer | undefined;

    if (!username || !password || !name || !position) {
        sendError(400, 'Please provide all necessary fields', next);
    }

    const newAdmin = await Admin.create({ username, password, name, position, profile_pic_type: profile_pic_type ? profile_pic_type : undefined, profile_pic_data: profile_pic_data ? profile_pic_data : undefined, last_login: undefined });

    res.status(201).json({ success: true, message: "A new admin has been successfully created" });
});

const updateAdmin = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { admin_id } = req.params;
    const { username, password, last_login, status } = req.body as { username?: string, password?: string, last_login?: Date, status?: string };
    const profile_pic_type = req.file?.mimetype as string | undefined;
    const profile_pic_data = req.file?.buffer as ArrayBuffer | undefined;

    const admin = await Admin.findByPk(admin_id);

    if (!admin) {
        sendError(400, 'Admin does not exist', next);
    }

    if (username) admin!.username = username;
    if (password) admin!.password = password;
    if (profile_pic_type) admin!.profile_pic_type = profile_pic_type;
    if (profile_pic_data) admin!.profile_pic_data = profile_pic_data;
    if (last_login) admin!.last_login = last_login;
    if (status) admin!.status = status;

    await admin?.save();

    res.status(200).json({ success: true, message: 'Selected Admin has been successfully updated', admin });
});

const deleteAdmin = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { admin_id } = req.params;

    const admin = await Admin.findByPk(admin_id);

    if (!admin) {
        sendError(400, 'Admin does not exist', next);
    }

    await admin?.destroy();

    res.status(200).json({ success: true, message: 'Selected admin has been successfully deleted' });
});

export { getMe, getAdmins, createNewAdmin, updateAdmin, deleteAdmin };