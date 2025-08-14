const asyncWrapper = require('../middleware/async')
const Task = require("../models/Task");

const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({})

    // just reference ways to send response //
    // res.status(200).json({ tasks })
    res.status(200).json({ tasks, amount: tasks.length });
    // res.status(200).json({ success: true, data: { tasks } });
    // res.status(200).json({ status: "success", data: { tasks } });
    // res.status(200).json({ success: true, data: { tasks, amount: tasks.length } });

});

const getATask = asyncWrapper(async (req, res) => {
    //use .findOne to display collections that has matched _id
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskID}` });
    }
    res.status(200).json({ task });
});

const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create(req.body);
    res.status(201).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskID });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskID}` });
    }
    res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req, res) => {
    const { id: taskID } = req.params;
    // passing value through req.body
    const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
      new: true,
      runValidators: true,
    });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskID}` });
    }
    res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  getATask,
  createTask,
  updateTask,
  deleteTask,
};
