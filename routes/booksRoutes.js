import { Router } from "express";

const router = Router();

import bookController from "../controllers/booksController.js";

router.post("/books",  bookController.createBook);

export default router
