const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  // error handling that shows response on the back side
  try {
    //use .find to display all the collections
    const tasks = await Task.find({});
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getATask = async (req, res) => {
  // error handling that shows response on the back side
  try {
    //use .findOne to display collections that has matched _id
    const { id: taskID } = req.params;
    const task = await Task.findOne({ _id: taskID });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createTask = async (req, res) => {
  // error handling that shows response on the back side
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateTask = (req, res) => {
  res.send("update task");
};

const deleteTask = (req, res) => {
  res.send("delete task");
};

module.exports = {
  getAllTasks,
  getATask,
  createTask,
  updateTask,
  deleteTask,
};
