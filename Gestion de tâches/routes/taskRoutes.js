import { Router} from "express";

const taskRouter = Router();
import taskControllers from "../controllers/taskControllers.js";

taskRouter.post("/tasks", taskControllers.createTask);
taskRouter.get("/tasks", taskControllers.getAllTasks);
taskRouter.get("/tasks/:id", taskControllers.getTaskById)



export default taskRouter;