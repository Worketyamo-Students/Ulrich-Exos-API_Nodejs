import fs from "fs";
import os from "os";
import { randomUUID } from "crypto";
// import { parse } from "jsonstream2";
// import { Stringifier } from "csv-stringify";
// import { pipeline } from "stream";

const databsejsonPath = "./Carnet dadresses/database.json";
const databsecsvPath = "./Carnet dadresses/database.csv";

const writeDatabasejson = (tableau)=>{
    fs.writeFile(databsejsonPath, JSON.stringify(tableau,null,2) , (err, data)=>{
        if (err) throw err;
    });
}
const writeDatabasecsv = (tableau)=>{
    const csv = ["id,name,tel,email"].concat(tableau.map(book => `${book.id}, ${book.name}, ${book.tel}, ${book.email}`)).join("\n")
    fs.writeFileSync(databsecsvPath, csv)
}
const contactController = {

    createContact: (req, res)=>{
    
            const {name, tel, email} = req.body;
            if(!name || !tel || !email){
                res.status(400).send({msg: "Creation failure: That informations are not complete"})
            } else{
    
                let book = {
                    "id" : randomUUID(),
                    "name": name,
                    "tel": tel,
                    "email": email
                } // Ajout de l'id à l'objet req.body
    
                fs.readFile(databsejsonPath , "utf-8", (err, data)=>{
                if(err) throw err;
        
                let database = JSON.parse(data || "[]");
                
                database.push(book);
        
                writeDatabasejson(database) //Il faut encore synchroniser avec le fichier database.csv
                writeDatabasecsv(database)
                
                
            })
            res.status(201).send({msg: "Created Successfully"})
            }
        },

        getAllContacts: (req,res)=>{
                fs.readFile(databsejsonPath, "utf8", (err, data) => {
                    if(err) throw err;

                    const database = JSON.parse(data);
                    res.status(200).json(database);
                })
        },

        getContactById: (req,res)=>{

                const {id} = req.params;
        
                fs.readFile(databsejsonPath, "utf8", (err, data) => {
                    if(err) throw err;
                    const database = JSON.parse(data);
        
                    let findContact = database.map(item=>{
                        // item.id == id? res.status(200).send(item) : null;
                        if(item.id == id){
                            return item;
                        }else{return null}
                    }).filter(item => item !== null);
                    if(findContact.length>0){
                        res.status(200).send(findContact[0])
                    }else{res.status(404).send({msg: "invalid id"})}
                })
        },

        updateContact: (req, res) =>{ 
        
                fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
                    if(err) throw err;
            
                    let database = JSON.parse(data);
        
                    const {name, tel, email} = req.body
                    const {id} = req.params
        
                    let findContact = database.map(item=>{
                        if(item.id == id){
                            name? item.name = name : item.name = item.name;
                            tel? item.tel = tel : item.tel = item.tel;
                            email? item.email = email : item.email = item.email;
                            return item;
                        }else{return null}
                    }).filter(item => item !== null);
                    if(findContact.length>0){
                        res.status(200).send({msg: "Updated successfuly"})
                    }else{res.status(404).send({msg: "invalid id"})}
        
                    writeDatabasejson(database) //Il faut encore synchroniser avec le fichier database.csv
                    writeDatabasecsv(database)
                })
            },

        deleteContact: (req, res) =>{ 
        
                fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
                    if(err) throw err;
            
                    let database = JSON.parse(data);
        
                    const {id} = req.params
                    let findContact = database.map((item,index)=>{
                        if(item.id == id){
                            return index;

                        }else{
                            return null
                        }
                    }).filter(item => item !== null);
                    if(findContact.length>0){
                        database.splice(findContact,1)
                        res.status(200).send({msg: "Book deleted"})
                    }else{res.status(404).send({msg: "invalid id"})}
        
                    writeDatabasejson(database) //Il faut encore synchroniser avec le fichier database.csv
                    writeDatabasecsv(database)
                    
                })
         },
        
         getStatus: (req,res)=>{

            fs.readFile(databsejsonPath, "utf8", (err, data) => {
                    if(err) throw err;

                    const nombreElements = JSON.parse(data).length;
                    const systeme = os.arch + " " + os.type

                    res.status(200).send(`Infos du systeme: ${systeme}. \nLa database a ${nombreElements} elements`);
                })
         }
}

export default contactController