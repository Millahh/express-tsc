"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const tasks_1 = require("../controllers/tasks");
router.route("/").get(tasks_1.getAllTasks).post(tasks_1.createTask);
router.route("/:id").get(tasks_1.getATask).patch(tasks_1.updateTask).delete(tasks_1.deleteTask);
exports.default = router;
//# sourceMappingURL=tasks.js.map