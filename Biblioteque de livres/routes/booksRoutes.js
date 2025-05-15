import { Router } from "express";

const router = Router();

import bookController from "../controllers/booksController.js";

router.post("/books",  bookController.createBook);
router.get ('/books', bookController.getAllBooks);
router.get ('/books/:id', bookController.getBookById);
router.put ('/books/:id', bookController.updateBook);
router.delete ('/books/:id', bookController.deleteBook);


export default router
