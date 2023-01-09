import express from "express";
const eventsRouter = express.Router();

// Load Middleware
import isAuthenicated from "../middleware/auth";

// Load Multer
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load Controllers
import { getAllEvents, getSingleEvent, createNewEvent, updateEvent, deleteEvent } from "../controllers/events";

if (process.env.NODE_ENV === 'production') {
    eventsRouter.route('/').get(getAllEvents).post([isAuthenicated, upload.single('poster')], createNewEvent);
    eventsRouter.route('/:event_id').get(getSingleEvent).put([isAuthenicated, upload.single('poster')], updateEvent).delete(isAuthenicated, deleteEvent);
} else {
    eventsRouter.route('/').get(getAllEvents).post(upload.single('poster'), createNewEvent);
    eventsRouter.route('/:event_id').get(getSingleEvent).put(upload.single('poster'), updateEvent).delete(deleteEvent);
}

export default eventsRouter;