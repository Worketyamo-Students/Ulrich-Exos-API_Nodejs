import { Router } from "express";

const router = Router();

import eventController from "../controllers/eventController.js";

router.post("/events", eventController.createEvent);
router.get ('/events', eventController.getAllEvents);
router.get ('/events/:id', eventController.getEventById);

export default router;