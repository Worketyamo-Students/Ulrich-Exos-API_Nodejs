import fs from "fs";
import { randomUUID } from "crypto";

const databsejsonPath = "./Catalogue produits/database.json";
const databsecsvPath = "./Catalogue produits/database.csv";

const writeDatabasejson = (tableau)=>{
    fs.writeFile(databsejsonPath, JSON.stringify(tableau,null,2) , (err, data)=>{
        if (err) throw err;
    });
}
const writeDatabasecsv = (tableau)=>{
    const csv = ["id,name,price,promo"].concat(tableau.map(book => `${book.id}, ${book.name}, ${book.price}, ${book.promo}`)).join("\n")
    fs.writeFileSync(databsecsvPath, csv)
}

const productController = {

    createProduct: (req, res)=>{
                
                const {name, price, promo} = req.body;
                if(!name || !price || !promo){
                    res.status(400).send({msg: "Creation failure: That informations are not complete"})
                } else{
        
                    let product = {
                        "id" : randomUUID(),
                        "name": name,
                        "price": price,
                        "promo": promo
                    } // Ajout de l'id
        
                    fs.readFile(databsejsonPath , "utf-8", (err, data)=>{
                    if(err) throw err;
            
                    let database = JSON.parse(data || "[]");
                    
                    database.push(product);
            
                    writeDatabasejson(database);

                    writeDatabasecsv(database)
                })
                res.status(201).send({msg: "Created Successfully"})
                }
    },
    
    getAllProducts: (req,res)=>{
                    fs.readFile(databsejsonPath, "utf8", (err, data) => {
                        if(err) throw err;
    
                        const database = JSON.parse(data);
                        res.status(200).json(database);
                    })
    },
    
    getProductById: (req,res)=>{
    
                    const {id} = req.params;
            
                    fs.readFile(databsejsonPath, "utf8", (err, data) => {
                        if(err) throw err;
                        const database = JSON.parse(data);
            
                        let findProduct = database.map(item=>{

                            if(item.id == id){
                                return item;
                            }else{return null}
                        }).filter(item => item !== null);
                        if(findProduct.length>0){
                            res.status(200).send(findProduct[0])
                        }else{res.status(404).send({msg: "invalid id"})}
                    })
    },
    
    updateProduct: (req, res) =>{ 
            
                    fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
                        if(err) throw err;
                
                        let database = JSON.parse(data);
            
                        const {name, price, promo} = req.body
                        const {id} = req.params
            
                        let findProduct = database.map(item=>{
                            if(item.id == id){
                                name? item.name = name : item.name = item.name;
                                price? item.price = price : item.price = item.price;
                                promo? item.promo = promo : item.promo = item.promo;
                                return item;
                            }else{return null}
                        }).filter(item => item !== null);
                        if(findProduct.length>0){
                            res.status(200).send({msg: "Updated successfuly"})
                        }else{res.status(404).send({msg: "Not Found:invalid id"})}
            
                        writeDatabasejson(database);

                        writeDatabasecsv(database)
                    })
    },
    
    deleteProduct: (req, res) =>{

        const {name, price, promo} = req.body
        const {id} = req.params
            
        fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
            if(err) throw err;
                
            let database = JSON.parse(data);
            
            let findProduct = database.map((item,index)=>{
                if(item.id == id){
                    return index;
    
                }else{
                    return null
                    }}).filter(item => item !== null);
            if(findProduct.length>0){
                database.splice(findProduct,1)
                res.status(200).send({msg: "product deleted"})
            }else{res.status(404).send({msg: "invalid id"})}
            
            writeDatabasejson(database);
            
            writeDatabasecsv(database)
        })
    },

    getProductsWithPromos: (req, res) => {
                
    }

}

export default productController