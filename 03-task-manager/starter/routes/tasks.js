const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getATask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks");

router.route("/").get(getAllTasks).post(createTask);
router.route("/:id").get(getATask).patch(updateTask).delete(deleteTask);

// instead of hardcoding the value, just pass the function
// router.route('/').get((req, res) => {
//     res.send('all items')
// })

module.exports = router;
