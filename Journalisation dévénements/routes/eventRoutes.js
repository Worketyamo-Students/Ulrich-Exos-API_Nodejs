import { Router } from "express";

const router = Router();

import eventController from "../controllers/eventController.js";

router.post("/events", eventController.createEvent);
router.get ('/events', eventController.getAllEvents);
router.get ('/events/:id', eventController.getEventById);
router.put ('/events/:id', eventController.updateEvent);
router.delete ('/events/:id', eventController.deleteEvent);
// router.get ('/events/compress-logs', eventController.compressLogs);

export default router;