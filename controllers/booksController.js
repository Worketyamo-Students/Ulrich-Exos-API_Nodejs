import fs from "fs";

let id = "Id-" + Math.floor(Math.random() * 1000); //Genere un id aleatoire

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
            }

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
}

export default bookController 