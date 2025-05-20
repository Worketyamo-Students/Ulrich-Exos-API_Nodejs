import fs from "fs";
import { randomUUID } from "crypto";
import { Writable } from "stream";
import { promisify } from "util";
import {EventEmitter} from "events";

const taskEmitter = new EventEmitter();

const databsejsonPath = "./Gestion de tâches/database.json";
const databsecsvPath = "./Gestion de tâches/database.csv";

const taskControllers = {

    createTask:(req,res) => {

       
        const {title, task, completed} = req.body;
        let newTask = {
            "id": randomUUID(),
            "title": title,
            "task": task,
            "completed": completed
        }
         //Ecoute de l'evenement
        taskEmitter.on('task created', (task)=>
            {
            console.log(`the task ${title} has been created`);
            
        })
        fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
            if(err) throw err;

            let database = JSON.parse(data);
            database.push(newTask);

            fs.writeFile(databsejsonPath, JSON.stringify(database,null,2), (err)=>{
                if (err) throw err;
                
                taskEmitter.emit('task created')//emettre l'evenement
                res.status(200).json({
                    msg: "Task created successfully",
                    newtask: newTask
                })
                
            })
        })
    },
}


export default taskControllers;