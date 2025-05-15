import { Router } from "express";

const router = Router();

import contactController from "../controllers/contactController.js";

router.post ('/contacts', contactController.createContact);
router.get('/contacts', contactController.getAllContacts);
router.get ('/contacts/:id', contactController.getContactById);
router.put ('/contacts/:id', contactController.updateContact);
// router.delete ('/contacts/:id', contactController.deleteContact);
// router.get ('/status', contactController.getStatus);

export default router;