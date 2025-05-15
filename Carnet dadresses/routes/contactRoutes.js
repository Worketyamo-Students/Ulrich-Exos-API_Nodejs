import { Router } from "express";

const router = Router();

import contactController from "../controllers/contactController.js";

router.post ('/contacts', contactController.createContact);
router.get('/contacts', contactController.getAllContacts);

export default router;