import fs from "fs";
import { randomUUID } from "crypto";
import { time } from "console";

const databsejsonPath = "/home/ulrich/Bureau/Devoirs NodeJS APIRest/Journalisation dévénements/database.json";
const databsecsvPath = "/home/ulrich/Bureau/Devoirs NodeJS APIRest/Journalisation dévénements/databse.csv";
const logStream = fs.createWriteStream("/home/ulrich/Bureau/Devoirs NodeJS APIRest/Journalisation dévénements/log.txt", { encoding: "utf-8", flags: "a" })
const eventController = {

    createEvent: (req, res)=>{
    
            const {name, date, origin} = req.body;
            if(!name || !date || !origin){
                res.status(400).send({msg: "Creation failure: That informations are not complete"})
                logStream.write('Event not added ' + Date() + "\n", () => {
                    console.log('Write completed, do more writes now.');
                }); //Ajout du log
            } else{

                let event = {
                    "id" : randomUUID(),
                    "name": name,
                    "date": date,
                    "origin": origin
                } // Ajout de l'id 
    
                fs.readFile(databsejsonPath , "utf-8", (err, data)=>{
                if(err) throw err;
        
                let database = JSON.parse(data);
                
                database.push(event);
        
                fs.writeFile(databsejsonPath , JSON.stringify(database,null,2) , (err, data)=>{
                    if (err) throw err;
                });
                fs.writeFile(databsecsvPath, JSON.stringify(database) , (err, data)=>{
                    if (err) throw err;
                });
                
            });
            logStream.write("Event added " + Date() + "\n", () => {
                    console.log('Write completed, do more writes now.');
                    });
            }
            res.status(201).send({msg: "Created Successfully"});
    }
}

export default eventController