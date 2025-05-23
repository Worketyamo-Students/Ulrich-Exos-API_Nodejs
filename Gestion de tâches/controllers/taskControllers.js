import fs, { readFile } from "fs";
import { randomUUID } from "crypto";
// import { Writable } from "stream";
// import { promisify } from "util";
import {EventEmitter} from "events";

const taskEmitter = new EventEmitter();

const databsejsonPath = "./Gestion de tâches/database.json";
const databsecsvPath = "./Gestion de tâches/database.csv";

const writeDatabasejson = (tableau)=>{
    fs.writeFile(databsejsonPath, JSON.stringify(tableau,null,2) , (err, data)=>{
        if (err) throw err;
    });
}

const writeDatabasecsv = (tableau)=>{
    const csv = ["id,title,task,completed"].concat(tableau.map(book => `${book.id}, ${book.title}, ${book.task}, ${book.completed}`)).join("\n")
    fs.writeFileSync(databsecsvPath, csv)
}
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
        taskEmitter.on('task created', (task)=>{
            console.log(`the task ${title} has been created`);
            
        })
        fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
            if(err) throw err;

            let database = JSON.parse(data || "[]");
            database.push(newTask);
            
            writeDatabasejson(database) //Il faut encore synchroniser avec le fichier database.csv
            writeDatabasecsv(database)

            taskEmitter.emit('task created')//emettre l'evenement
            res.status(200).json({
                msg: "Task created successfully",
                newtask: newTask
            })

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

        const index = database.findIndex(task => task.id === id); //methode plus concise pour reperer l'element dans le tableau
        if (index !== -1) {
            res.status(200).send(database[index])
        } else {
            res.status(404).send({msg: "invalid id"});
        }
        
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
    },

    updateTask: (req, res)=>{


        const {title, task, completed} = req.body;
        const {id} = req.params;

        taskEmitter.on('taskUpdated', (task)=>{
            console.log(`the task ${title} has been updated`);
            
        })

        fs.readFile(databsejsonPath, "utf-8", (err, data)=>{
            if(err) throw err;
                
            let database = JSON.parse(data);
                        
            let findTask = database.map(item=>{

                if(item.id == id){
                    title? item.title = title : item.title = item.title;
                    task? item.task = task : item.task = item.task;
                    completed? item.completed = completed : item.completed = item.completed;
                    return item;

                }else{return null}}).filter(item => item !== null);
                
                if(findTask.length>0){
                    taskEmitter.emit("taskUpdated");
                    res.status(200).send({msg: "Updated successfuly",
                        updated: findTask[0]
                    })
                }else{res.status(404).send({msg: "Not Found:invalid id"})}
            
            writeDatabasejson(database);
            writeDatabasecsv(database)
        })

    },

    deleteTask: (req, res)=>{

        const {title, task, completed} = req.body;
        const {id} = req.params;

        taskEmitter.on('taskDeleted', (task)=>{
            console.log(`the task ${title} has been deleted`);
            
        })
        fs.readFile(databsejsonPath, (err, data)=>{
            if(err) throw err;

            let database = JSON.parse(data);

            const index = database.findIndex(task => task.id === id);
            database.splice(index, 1)

            taskEmitter.emit('taskDeleted');

            writeDatabasejson(database); //Il faut synchroniser vaec le database.csv
            writeDatabasecsv(database)      
            res.status(200).send({msg: "Deleted successfuly"})
        })
    }
}


export default taskControllers;