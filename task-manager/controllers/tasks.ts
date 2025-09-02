import { Request, Response, NextFunction } from 'express';
import { createCustomError } from '../errors/custom-error';
import asyncWrapper from '../middleware/async'
import Task from "../models/Task";


const getAllTasks = asyncWrapper(async (req: Request, res: Response) => {
  const tasks = await Task.find({})
  res.status(200).json({ tasks, amount: tasks.length });

});

const getATask = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  //use .findOne to display collections that has matched _id
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  //for special case (_id with the same length of characters but not matching)
  if (!task) {
    return next(createCustomError(`No task with id: ${taskID}`, 404))
  }
  res.status(200).json({ task });
});

const createTask = asyncWrapper(async (req: Request, res: Response) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const deleteTask = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  //for special case (_id with the same length of characters but not matching)
  if (!task) {
    return next(createCustomError(`No task with id: ${taskID}`, 404))
  }
  res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { id: taskID } = req.params;
  // passing value through req.body
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });
  //for special case (_id with the same length of characters but not matching)
  if (!task) {
    return next(createCustomError(`No task with id: ${taskID}`, 404))
  }
  res.status(200).json({ task });
});

export {
  getAllTasks,
  getATask,
  createTask,
  updateTask,
  deleteTask,
};
