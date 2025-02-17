const asyncHandler = require("../utils/asyncHandler");
const { createTrelloServices, fetchTasksService, fetchStatusService, updateTaskServices ,changeStatusServices,deleteTrelloServices,dragAndDropServices} = require("../services/personalTrelloServices");

// Create a Trello task
exports.CreateTrello = asyncHandler(async (req, res) => {
  const { title, category, status, priority } = req.body;
  console.log(priority,"priority")
  const userID =   req.user.id;  

  const trello = await createTrelloServices({ userID, title, category, status, priority });
  console.log(trello)
  res.status(201).json({
    message: "Trello created successfully",
    trello,
  });
});

// Fetch tasks
exports.fetchTasks = asyncHandler(async (req, res) => {  
  const userID = req.user.id;  
  const tasks = await fetchTasksService(userID);

  res.status(200).json({ success: true, tasks });
});

// Update task status
exports.updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userID = req.user.id;  

  const task = await updateTaskServices(userID, taskId, status);
  
  res.status(200).json({ message: "Task status updated successfully", task });
});

//change status name
exports.changeStatus = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const { oldStatus, newStatus } = req.body;

  const statusUpdate = await changeStatusServices(userID, oldStatus, newStatus);

  res.status(200).json({ success: true, ...statusUpdate });
})

//delete task
 exports.deleteStatus = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const { taskId } = req.params;
  const data = await deleteTrelloServices(userID, taskId);
  if (data.deletedCount === 0) {
    return res.status(404).json({ success: false, message: "Task not found or not authorized to delete." });
  }
  res.status(200).json({ success: true, message: "Task deleted successfully", data });
});

//Drag and drop
exports.dragAndDrop = asyncHandler(async (req, res) => {
  console.log("in controller.....")
  const { taskId } = req.params; 
  const { status } = req.body;  
  const updatedTask = await dragAndDropServices(taskId, status);

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    updatedTask, 
  });
});