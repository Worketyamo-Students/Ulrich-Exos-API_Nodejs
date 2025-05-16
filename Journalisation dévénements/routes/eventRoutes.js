import { Router } from "express";

const router = Router();

import eventController from "../controllers/eventController.js";

router.post("/events", eventController.createEvent)

export default router;