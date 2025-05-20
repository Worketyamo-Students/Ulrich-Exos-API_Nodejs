import fs, { readFile } from "fs";
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
                
            }) //Il faut encore synchroniser avec le fichier database.csv
        })
    },

    getAllTasks: (req, res)=>{
        fs.readFile(databsejsonPath, (err, data)=>{
        if(err) throw err;

        let database = JSON.parse(data);
        res.status(200).send(database)
        })
    },

    getTaskById: (req, res)=>{

        const {id} = req.params;

        fs.readFile(databsejsonPath, (err, data)=>{
        if(err) throw err;

        let database = JSON.parse(data);
        const index = database.findIndex(task => task.id === id);
        console.log(index);
        
        res.send(database[index]);
        // let findTask = database.map(item=>{

        //         if(item.id == id){
        //             return item;
        //         }else{return null}
        // }).filter(item => item !== null);
        // if(findTask.length>0){
        //     res.status(200).send(findTask[0])
        // }else{res.status(404).send({msg: "invalid id"})}
        
        })
    }
}


export default taskControllers;