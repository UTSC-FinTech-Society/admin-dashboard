import express from "express";
import asyncHandler from "express-async-handler";
import { sendError } from "../middleware/error";
import Member from "../models/Member";

const getMembers = asyncHandler(async (req: express.Request, res: express.Response) => {
    const members = await Member.findAll();
    res.status(200).json({ success: true, members: members });
});

const addNewMember = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { first_name, last_name, student_number, email_address, year_of_study, program, campus } = req.body as { first_name: string, last_name: string, student_number: number, email_address: string, year_of_study: string, program: string, campus: string }; 

    if (!first_name || !last_name || !student_number || !email_address || !year_of_study || !program || !campus) {
        sendError(400, 'Please provide all necessary fields', next);
    }

    const newMember = await Member.create({ first_name, last_name, student_number, email_address, year_of_study, program, campus, timestamp: new Date() });
    res.status(201).json({ success: true, message: 'A new member has been successfully added', member: newMember });
});

const updateMember = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { member_id } = req.params;
    const { first_name, last_name, student_number, email_address, year_of_study, program, campus } = req.body; 

    const member = await Member.findByPk(member_id);

    if (!member) {
        sendError(400, 'Member does not exist', next);
    }

    if (first_name) member!.first_name = first_name;
    if (last_name) member!.last_name = last_name;
    if (student_number) member!.student_number = student_number;
    if (email_address) member!.email_address = email_address;
    if (year_of_study) member!.year_of_study = year_of_study;
    if (program) member!.program = program;
    if (campus) member!.campus = campus;

    await member?.save();

    res.status(200).json({ success: true, message: 'Selected member has been successfully updated', member });
});

const deleteMember = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { member_id } = req.params;

    const member = await Member.findByPk(member_id);

    if (!member) {
        sendError(400, 'Member does not exist', next);
    }   

    await member!.destroy();

    res.status(200).json({ success: true, message: 'Selected member has been successfully deleted' });
});

export { getMembers, addNewMember, updateMember, deleteMember };
