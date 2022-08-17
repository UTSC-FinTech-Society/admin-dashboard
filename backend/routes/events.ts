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
 
eventsRouter.route('/').get(getAllEvents).post([isAuthenicated, upload.single('poster')], createNewEvent);

eventsRouter.route('/:event_id').get(getSingleEvent).put([isAuthenicated, upload.single('poster')], updateEvent).delete(isAuthenicated, deleteEvent);

export default eventsRouter;