import express from "express";
import bodyParser from "body-parser";
import chalk from "chalk";

import bookRouter from "./Biblioteque de livres/routes/booksRoutes.js";
import contactRouter from "./Carnet dadresses/routes/contactRoutes.js";
import eventRouter from "./Journalisation dévénements/routes/eventRoutes.js";
import productRouter from "./Catalogue produits/routes/productRoutes.js";
import taskRouter from "./Gestion de tâches/routes/taskRoutes.js";
import convertCsvToExcel from "./Carnet dadresses/convertCsvInXsls.js";

const app = express();

app.use(bodyParser.json());

const port = 3000;
app.listen(port, (err)=>{
    if(err) throw err;

    console.log(chalk.blueBright("le serveur s'execute à l'adresse: ") + chalk.yellow(`http://localhost:${port}`));
})
app.use("/", bookRouter);
app.use("/", contactRouter);
app.use("/", eventRouter);
app.use("/", productRouter);
app.use("/", taskRouter);
