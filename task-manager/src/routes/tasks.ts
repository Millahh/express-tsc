import express from "express";
const router = express.Router();
import {
  getAllTasks,
  getATask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks";

router.route("/").get(getAllTasks).post(createTask);
router.route("/:id").get(getATask).patch(updateTask).delete(deleteTask);

export default router;
