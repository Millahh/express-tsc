const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  // error handling that shows response on the back side
  try {
    //use .find to display all the collections
    const tasks = await Task.find({});

    // just reference ways to send response //
    // res.status(200).json({ tasks })
    res.status(200).json({ tasks, amount: tasks.length });
    // res.status(200).json({ success: true, data: { tasks } });
    // res.status(200).json({ status: "success", data: { tasks } });
    // res.status(200).json({ success: true, data: { tasks, amount: tasks.length } });

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

const deleteTask = async (req, res) => {
  // error handling that shows response on the back side
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskID });
    //for special case (_id with the same length of characters but not matching)
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateTask = async (req, res) => {
  // error handling that shows response on the back side
  try {
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
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllTasks,
  getATask,
  createTask,
  updateTask,
  deleteTask,
};
