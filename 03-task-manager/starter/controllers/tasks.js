const Task = require('../models/Task')

const getAllTasks =  (req, res) => {
    res.send(req.body)
}

const getATask =  (req, res) => {
    res.json({ id: req.params.id })
}

const createTask = async (req, res) => {
    const task = await Task.create(req.body)
    res.status(201).json({ task })
}

const updateTask =  (req, res) => {
    res.send('update task')
}

const deleteTask =  (req, res) => {
    res.send('delete task')
}

module.exports = {
    getAllTasks,
    getATask,
    createTask,
    updateTask,
    deleteTask
}