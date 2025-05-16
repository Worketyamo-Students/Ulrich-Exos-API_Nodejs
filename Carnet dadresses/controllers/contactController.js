import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

const databsejsonPath = "/home/ulrich/Bureau/Devoirs NodeJS APIRest/Carnet dadresses/database.json";
const databsecsvPath = "/home/ulrich/Bureau/Devoirs NodeJS APIRest/Carnet dadresses/database.csv";

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
        
                let database = JSON.parse(data);
                
                database.push(book);
        
                fs.writeFile(databsejsonPath , JSON.stringify(database,null,2) , (err, data)=>{
                    if (err) throw err;
                });
                fs.writeFile(databsecsvPath, JSON.stringify(database) , (err, data)=>{
                    if (err) throw err;
                })
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
        
                    // database.map((item)=>{
        
                    //    if(item.id == id){
        
                    //     name? item.name = name : item.name = item.name;
                    //     tel? item.tel = tel : item.tel = item.tel;
                    //     email? item.email = email : item.email = item.email;
                        
                    //    } else {return res.status(404).send({msg: "Invalid id"})}
                    // })

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
        
                    fs.writeFile(databsejsonPath, JSON.stringify(database,null,2) , (err, data)=>{
                        if (err) throw err;
                    })
                    fs.writeFile(databsecsvPath, JSON.stringify(database) , (err, data)=>{
                        if (err) throw err;
                    })
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
        
                    fs.writeFile(databsejsonPath, JSON.stringify(database,null,2) , (err, data)=>{
                        if (err) throw err;
                    })
                    fs.writeFile(databsecsvPath, JSON.stringify(database) , (err, data)=>{
                        if (err) throw err;
                    })
                })
            }
        
}

export default contactController