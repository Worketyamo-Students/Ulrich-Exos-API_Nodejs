import fs from "fs";
import { randomUUID } from "crypto";
import zlib from "zlib"
import { pipeline } from 'node:stream';


const databsejsonPath = "./Journalisation dévénements/database.json";
const databsecsvPath = "./Journalisation dévénements/databse.csv";

const writeDatabasejson = (tableau)=>{
    fs.writeFile(databsejsonPath, JSON.stringify(tableau,null,2) , (err, data)=>{
        if (err) throw err;
    });
}
const logStream = fs.createWriteStream("./Journalisation dévénements/log.txt", { encoding: "utf-8", flags: "a" });

const eventController = {
  createEvent: (req, res) => {
    const { name, date, origin } = req.body;
    if (!name || !date || !origin) {
      res.status(400).send({ msg: "Creation failure: That informations are not complete" });

      logStream.write("Event not added " + Date() + "\n", () => {
        console.log("Write completed, do more writes now.");
      }); //Ajout du log

    } else {
      let event = {
        "id": randomUUID(),
        "name": name,
        "date": date,
        "origin": origin
      }; // Ajout de l'id

      fs.readFile(databsejsonPath, "utf-8", (err, data) => {
        if (err) throw err;

        let database = JSON.parse(data || "[]");

        database.push(event);

        writeDatabasejson(database);

        fs.writeFile(databsecsvPath, JSON.stringify(database), (err, data) => {
          if (err) throw err;
        });
      });
      logStream.write("Event added " + Date() + "\n", () => {
        console.log("Write completed, do more writes now.");
      });
    }
    res.status(201).send({ msg: "Created Successfully" });
  },

  getAllEvents: (req, res) => {
    fs.readFile(databsejsonPath, "utf8", (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      logStream.write(`recived request: ${req.method}; ${req.url}: ${Date()} \n`, (err) => {
          if (err) throw err;
          console.log("Write completed");
        }
      );
      res.status(200).json(database);
    });
  },

  getEventById: (req, res) => {
    const { id } = req.params;

    fs.readFile(databsejsonPath, "utf8", (err, data) => {
      if (err) throw err;
      const database = JSON.parse(data);

      let findEvent = database.map((item) => {
          if (item.id == id) {
            return item;
          } else {
            return null;
          }
        }).filter((item) => item !== null);
        logStream.write(`recived request: ${req.method}; ${req.url}: ${Date()} \n`, (err) => {
            if (err) throw err;
            console.log("Write completed");
          }
        );
      if (findEvent.length > 0) {
        res.status(200).send(findEvent[0]);
      } else {
        res.status(404).send({ msg: "Not found: invalid id" });
      }
    });
  },

  updateEvent: (req, res) => {
    fs.readFile(databsejsonPath, "utf-8", (err, data) => {
      if (err) throw err;

      let database = JSON.parse(data);

      const { name, date, origin } = req.body;
      const { id } = req.params;

      let findEvent = database.map((item) => {
          if (item.id == id) {
            name ? (item.name = name) : (item.name = item.name);
            date ? (item.date = date) : (item.date = item.date);
            origin ? (item.origin = origin) : (item.origin = item.origin);
            return item;
          } else {
            return null;
          }
        }).filter((item) => item !== null);

      if (findEvent.length > 0) {
        logStream.write("Event updated " + Date() + "\n", () => {
          console.log("Write completed");
        });
        res.status(200).send({ msg: "Updated successfuly" });
      } else {
        logStream.write("Event are not added " + Date() + "\n", () => {
          console.log("Write completed, do more writes now.");
        });
        res.status(404).send({ msg: "Not found: invalid id" });
      }

      writeDatabasejson(database);

      fs.writeFile(databsecsvPath, JSON.stringify(database), (err, data) => {
        if (err) throw err;
      });
    });
  },
  deleteEvent: (req, res) =>{

          
    fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
        if(err) throw err;
              
        let database = JSON.parse(data);
          
        const {id} = req.params
        let findEvent = database.map((item,index)=>{
            if(item.id == id){
                return index;
  
            }else{
                return null
            }
        }).filter(item => item !== null);

        if(findEvent.length>0){
                database.splice(findEvent,1)
                logStream.write("Event deleted " + Date() + "\n", () => {
                    console.log("Write completed, do more writes now.");
                });
                res.status(200).send({msg: "Event deleted"})
        }else{
            logStream.write("Event are not deleted " + Date() + "\n", () => {
                console.log("Write completed, do more writes now.");
            });
            res.status(404).send({msg: "Not found: invalid id"})
        }
          
        writeDatabasejson(database);

        fs.writeFile(databsecsvPath, JSON.stringify(database) , (err, data)=>{
            if (err) throw err;
        })
    })
  },
  compressLogs: (req, res)=>{
    const gzip = zlib.createGzip()
    const input = "./Journalisation dévénements/log.txt"
    const output = "./Journalisation dévénements/compress.txt.gz"
    const source = fs.createReadStream(input);
    const destination = fs.createWriteStream(output);
    pipeline(source, gzip, destination, (err) => {
        if (err) throw err

        console.log("Compression was succesfully");
        res.status(200).json({msg: "Compression was succesfully"})
            
    })
  }
};

export default eventController;