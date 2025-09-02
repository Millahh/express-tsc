"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getATask = exports.getAllTasks = void 0;
const custom_error_1 = require("../errors/custom-error");
const async_1 = __importDefault(require("../middleware/async"));
const Task_1 = __importDefault(require("../models/Task"));
const getAllTasks = (0, async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield Task_1.default.find({});
    res.status(200).json({ tasks, amount: tasks.length });
}));
exports.getAllTasks = getAllTasks;
const getATask = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //use .findOne to display collections that has matched _id
    const { id: taskID } = req.params;
    const task = yield Task_1.default.findOne({ _id: taskID });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
        return next((0, custom_error_1.createCustomError)(`No task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
}));
exports.getATask = getATask;
const createTask = (0, async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield Task_1.default.create(req.body);
    res.status(201).json({ task });
}));
exports.createTask = createTask;
const deleteTask = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: taskID } = req.params;
    const task = yield Task_1.default.findOneAndDelete({ _id: taskID });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
        return next((0, custom_error_1.createCustomError)(`No task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
}));
exports.deleteTask = deleteTask;
const updateTask = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: taskID } = req.params;
    // passing value through req.body
    const task = yield Task_1.default.findOneAndUpdate({ _id: taskID }, req.body, {
        new: true,
        runValidators: true,
    });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
        return next((0, custom_error_1.createCustomError)(`No task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
}));
exports.updateTask = updateTask;
//# sourceMappingURL=tasks.js.map