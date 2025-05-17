import { Router } from "express";

const contactRouter = Router();

import contactController from "../controllers/contactController.js";

contactRouter.post ('/contacts', contactController.createContact);
contactRouter.get('/contacts', contactController.getAllContacts);
contactRouter.get ('/contacts/:id', contactController.getContactById);
contactRouter.put ('/contacts/:id', contactController.updateContact);
contactRouter.delete ('/contacts/:id', contactController.deleteContact);
contactRouter.get ('/status', contactController.getStatus);

export default contactRouter;