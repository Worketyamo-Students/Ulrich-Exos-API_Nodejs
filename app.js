import express from "express";
import bodyParser from "body-parser";

import bookRouter from "./Biblioteque de livres/routes/booksRoutes.js";
import contactRouter from "./Carnet dadresses/routes/contactRoutes.js";
import eventRouter from "./Journalisation dévénements/routes/eventRoutes.js";
import productRouter from "./Catalogue produits/routes/productRoutes.js";

const app = express();

app.use(bodyParser.json());

const port = 3000;
app.listen(port, (err)=>{
    if(err) throw err;

    console.log(`le serveur a démarré sur le port ${port}`);  
})
app.use("/", bookRouter);
app.use("/", contactRouter);
app.use("/", eventRouter);
app.use("/", productRouter);