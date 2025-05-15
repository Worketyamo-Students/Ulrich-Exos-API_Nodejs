import fs from "fs";

let id = Math.floor(Math.random() * 20); //Genere un id aleatoire

const bookController = {

    createBook: (req, res)=>{

        const {name, author, price} = req.body;
        if(!name || !author || !price){
            res.status(400).send({msg: "Creation failure: That informations are not complete"})
        } else{

            let book = {
                "id" : id,
                "name": name,
                "author": author,
                "price": price
            } // Ajout de l'id à l'objet req.body

            fs.readFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", "utf-8", (err, data)=>{
            if(err) throw err;
    
            let database = JSON.parse(data);
            
            database.push(book);
    
            fs.writeFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", JSON.stringify(database) , (err, data)=>{
                if (err) throw err;
            })
        })
        res.status(200).send({msg: "Created Successfully"})
        }
    },

    getAllBooks: (req,res)=>{
        fs.readFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", "utf8", (err, data) => {
            if(err) throw err;
            const database = JSON.parse(data);
            res.status(200).json(database);
        })
    },

    getBookById: (req,res)=>{
        const {id} = req.params;

        fs.readFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", "utf8", (err, data) => {
            if(err) throw err;
            const database = JSON.parse(data);

            database.map((item, index)=>{
                item.id == id? res.status(200).send(item) : res.status(400).json({msg: "invalid id"})
            })
        })
    },

    updateBook: (req, res) =>{ 

        fs.readFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", "utf-8", (err, data)=>{
            if(err) throw err;
    
            let database = JSON.parse(data);

            const {name, author, price} = req.body
            const {id} = req.params

            database.map((item)=>{

               if(item.id == id){

                name? item.name = name : item.name = item.name;
                author? item.author = author : item.author = item.author;
                price? item.price = price : item.price = item.price;

                res.status(200).send({msg: "Updated successfully"});
                
               } else {res.status(400).send({msg: "Invalid id"})}
            })

            fs.writeFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", JSON.stringify(database) , (err, data)=>{
                if (err) throw err;
            })
        })
    },

    deleteBook: (req, res) =>{ 

        fs.readFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", "utf-8", (err, data)=>{
            if(err) throw err;
    
            let database = JSON.parse(data);

            const {id} = req.params
            database.map((item, index)=>{
               if(item.id == id){

                database.splice(index, 1);

                res.status(200).send({msg: "Deleted successfully"})

               } else {res.status(400).send({msg: "Invalid id"})}
            })

            fs.writeFile("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Biblioteque de livres/database.json", JSON.stringify(database) , (err, data)=>{
                if (err) throw err;
            })
        })
    }
}

export default bookController 