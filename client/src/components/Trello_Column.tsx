import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { CiMenuKebab } from "react-icons/ci";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { Droppable, Draggable } from "@hello-pangea/dnd";
interface Task {
  _id: string;
  title: string;
  dueDate: string;
  category: string;
  priority: string;
  attachment: string[];
}
interface addtask {
  title: string;
  dueDate: string;
  category: string;
  priority: string;
  attachment: string[];
}
interface TrelloColumnProps {
  status: string;
  tasksList: Task[];
  onDelete: (status: string) => void;
  onRename: (oldStatus: string, newStatus: string) => void;
  onAddTask: (status: string, task: addtask) => void;
  onDeleteTask: (id: string) => void;
}

const TrelloColumn: React.FC<TrelloColumnProps> = ({
  status,
  tasksList,
  onDelete,
  onRename,
  onAddTask,
  onDeleteTask,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(status);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("high");
  const [category, setCategory] = useState("");
  const [buttonAddTask, setButtonAddTask] = useState(false);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (newTitle.trim() && newTitle !== status) {
      onRename(status, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask(status, {
        title: taskTitle,
        dueDate: "",
        category,
        priority: priority.toLocaleLowerCase(),
        attachment: [],
      });
      setTaskTitle("");
      setCategory("");
      setIsAddingTask(false);
    }
  };

  return (
    <div
      className="flex flex-col min-w-[260px] h-full rounded-md  bg-lightDark overflow-x-auto scrollbar-hidden"
      onMouseEnter={() => setButtonAddTask(true)}
      onMouseLeave={() => setButtonAddTask(false)}
    >
      {/* Column Header */}
      <div
        className="flex justify-between items-center p-2 rounded-md sticky top-0 bg-lightDark z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3 w-full">
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              autoFocus
              className="bg-transparent text-primaryDark outline-none px-2 py-1 rounded-md w-full"
            />
          ) : (
            <p
              className="text-md text-primaryDark font-semibold font-poppins cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {status}
            </p>
          )}
        </div>

        {isHovered && (
          <div className="relative">
            <CiMenuKebab
              className="text-primaryDark cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md p-2">
                <button
                  className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                  onClick={() => {
                    onDelete(status);
                    setMenuOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col px-3 overflow-y-auto scrollbar-hidden">
        <Droppable droppableId={status} type="task">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-col gap-5 flex-1"
            >
              {tasksList.map((task, index) => (
                <Draggable
                  key={task.title}
                  draggableId={task._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative p-3 bg-pureWhite rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)]  mb-5 h-32${
                        snapshot.isDragging ? "z-50 shadow-lg" : ""
                      }`}
                    >
                      <TaskCard
                        key={task._id}
                        {...task}
                        onDeleteTask={onDeleteTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Add Task Section */}
        <div className="mt-2">
          {isAddingTask && (
            <div className="flex h-full bg-pureWhite rounded-xl flex-col shadow-md gap-2 p-2 over">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="text-[11px] bg-transparent text-primaryDark outline-none px-2 rounded-md"
                placeholder="Enter task title..."
                autoFocus
              />
              {/* Priority Selection */}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="text-[10px] p-1 rounded-md text-primaryDark"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-[11px] bg-transparent text-primaryDark outline-none px-2 rounded-md"
                placeholder="Enter task category..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  className="bg-transparent text-lightGreen px-4 py-1 hover:text-primaryDark"
                >
                  <TiTick />
                </button>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="bg-transparent text-priorityRed px-4 py-1 hover:text-primaryDark"
                >
                  <IoMdClose size={16} />
                </button>
              </div>
            </div>
          )}
          {buttonAddTask && (
            <button
              onClick={() => setIsAddingTask(true)}
              className="text-sm text-primaryDark hover:underline"
            >
              + Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrelloColumn;
