const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { CreateTrello, updateTaskStatus, fetchTasks, changeStatus, deleteStatus, dragAndDrop } = require("../controllers/personalTrelloController");
const { fetchStatus, addStatus, deletestatus } = require("../controllers/personalStatusContoller");
const router = express.Router();

// Routes for Personal Trello
router.post("/createTrello", verifyToken, CreateTrello);
router.get("/fetchTasks", verifyToken, fetchTasks);
router.get("/fetchStatuses", verifyToken, fetchStatus);
router.patch("/updateTask/:taskId", verifyToken, updateTaskStatus);
router.patch("/addColumn", verifyToken, addStatus)
router.patch("/changeStatus", verifyToken, changeStatus)
router.delete("/deleteStatus", verifyToken, deletestatus)
router.delete("/deleteTrello/:taskId", verifyToken, deleteStatus)
router.patch("/dragAndDrop/:taskId", verifyToken, dragAndDrop)
module.exports = router;
