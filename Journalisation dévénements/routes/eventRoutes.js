import { Router } from "express";

const eventRouter = Router();

import eventController from "../controllers/eventController.js";

eventRouter.post("/events", eventController.createEvent);
eventRouter.get ('/events', eventController.getAllEvents);
eventRouter.get ('/events/compress-logs', eventController.compressLogs);
eventRouter.get ('/events/:id', eventController.getEventById);
eventRouter.put ('/events/:id', eventController.updateEvent);
eventRouter.delete ('/events/:id', eventController.deleteEvent);

export default eventRouter;