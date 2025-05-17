import { Router } from "express";

const bookRouter = Router();

import bookController from "../controllers/booksController.js";

bookRouter.post("/books",  bookController.createBook);
bookRouter.get ('/books', bookController.getAllBooks);
bookRouter.get ('/books/:id', bookController.getBookById);
bookRouter.put ('/books/:id', bookController.updateBook);
bookRouter.delete ('/books/:id', bookController.deleteBook);


export default bookRouter
