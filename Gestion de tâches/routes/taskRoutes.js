import { Router} from "express";

const taskRouter = Router();
import taskControllers from "../controllers/taskControllers.js";

taskRouter.post("/tasks", taskControllers.createTask);



export default taskRouter;