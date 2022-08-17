import express from "express";
import asyncHandler from "express-async-handler";
import Event from "../models/Event";
import { sendError } from "../middleware/error";

const getAllEvents = asyncHandler(async (req: express.Request, res: express.Response) => {
    const events = await Event.findAll();
    res.status(200).json({ success: true, events: events });
});

const getSingleEvent = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { event_id } = req.params;

    const event = await Event.findByPk(event_id);

    if (!event) {
        sendError(400, 'Event does not exist', next);
    }

    res.status(200).json({ success: true, event: event });
});

const createNewEvent = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, description, register_deadline, start_datetime, end_datetime, entry_fee, location, signup_link } = req.body as { name: string, description: string, register_deadline: Date, start_datetime: Date, end_datetime: Date, entry_fee?: number, location: string, signup_link?: string };
    const poster_type = req.file?.mimetype as string;
    const poster_data = req.file?.buffer as ArrayBuffer; 

    if (!name || !description || !register_deadline || !start_datetime || !end_datetime || !location || !poster_type || !poster_data) {
        sendError(400, 'Please provide all the required fields', next);
    }

    const newEvent = await Event.create({ name, description, register_deadline: new Date(register_deadline), start_datetime: new Date(start_datetime), end_datetime: new Date(end_datetime), entry_fee: entry_fee ? Number(entry_fee) : undefined, location, poster_type, poster_data, signup_link: signup_link ? signup_link : undefined, created_at: new Date() });
    res.status(201).json({ success: true, message: 'A new event has been successfully created', event: newEvent });
});

const updateEvent = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { event_id } = req.params;
    const { name, description, register_deadline, start_datetime, end_datetime, entry_fee, location, signup_link } = req.body as { name?: string, description?: string, register_deadline?: Date, start_datetime?: Date, end_datetime?: Date, entry_fee?: number, location?: string, signup_link?: string };
    const poster_type = req.file?.mimetype as string | undefined;
    const poster_data = req.file?.buffer as ArrayBuffer | undefined;

    const event = await Event.findByPk(event_id);

    if (!event) {
        sendError(400, 'Event does not exist', next);
    }

    if (name) event!.name = name;
    if (description) event!.description = description;
    if (register_deadline) event!.register_deadline = new Date(register_deadline);
    if (start_datetime) event!.start_datetime = new Date(start_datetime);
    if (end_datetime) event!.end_datetime = new Date(end_datetime);
    if (entry_fee) event!.entry_fee = Number(entry_fee);
    if (location) event!.location = location;
    if (poster_type) event!.poster_type = poster_type;
    if (poster_data) event!.poster_data = poster_data;
    if (signup_link) event!.signup_link = signup_link;

    await event?.save();

    res.status(200).json({ success: true, message: 'Selected event has been successfully updated', event});
});

const deleteEvent = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { event_id } = req.params;

    const event = await Event.findByPk(event_id);

    if (!event) {
        sendError(400, 'Event does not exist', next);
    }

    await event!.destroy();

    res.status(200).json({ success: true, message: 'Selected event has been successfully deleted'});
});

export { getAllEvents, getSingleEvent, createNewEvent, updateEvent, deleteEvent };