"use client";
import React, { useState, useEffect } from "react";
import TrelloColumn from "@/components/Trello_Column";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskToTrello,
  updateTaskStatus,
  fetchTasks,
  fetchStatuses,
  renameStatus,
  addColumn,
  deleteStatus,
  deleteTask,
} from "../../../redux/features/personalSlice";
import { AppDispatch, RootState } from "../../../redux/app/store";

interface Task {
  _id: string;
  title: string;
  dueDate: string;
  status: string;
  category: string;
  priority: string;
  attachment: string[];
}

const Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, statuses } = useSelector((state: RootState) => state.trello);
  const [newColumn, setNewColumn] = useState<boolean>(false);
  const [columnName, setColumnName] = useState<string>("");

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchStatuses());
  }, [dispatch]);

  //add new columns
  const handleAddColumn = () => {
    const trimmedColumn = columnName.trim().toLowerCase();
    if (!trimmedColumn) return;
    if (statuses.includes(trimmedColumn)) {
      alert("Column already exists!");
      return;
    }
    dispatch(addColumn(trimmedColumn))
      .unwrap()
      .then(() => {
        alert("Column added successfully!");
      })
      .catch((err) => {
        alert(err);
      });
    setColumnName("");
    setNewColumn(false);
  };

  //delete the columns
  const deleteColumn = (status: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the column "${status}"? This will also remove all associated tasks.`
      )
    ) {
      dispatch(deleteStatus({ status }))
        .unwrap()
        .then(() => alert(`Deleted ${status} and its tasks successfully!`))
        .catch((error) => alert(error));
    }
  };

  // rename the coloumns
  const renameColumn = (oldStatus: string, newStatus: string) => {
    if (statuses.includes(newStatus)) {
      alert("Column with this name already exists!");
      return;
    }
    dispatch(renameStatus({ oldStatus, newStatus }))
      .unwrap()
      .then(() => {
        alert(`Renamed ${oldStatus} to ${newStatus} successfully!`);
      })
      .catch((error) => alert(error));
  };

  //add new task
  const addTask = (status: string, task: Task) => {
    dispatch(addTaskToTrello({ ...task, status }));
  };

  //delete task
  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  //Drag and Drop
  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    const newStatus = destination.droppableId;
    console.log(
      `source:${source}  ,destination:${destination} draggableId:${draggableId}`
    );
    dispatch(updateTaskStatus({ taskId: draggableId, newStatus }));
  };

  return (
    <div className="h-screen">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5 h-full overflow-x-auto p-8 scrollbar-hidden">
          {statuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <TrelloColumn
                    key={status}
                    status={status}
                    tasksList={tasks.filter((task) => task.status === status)}
                    onDelete={deleteColumn}
                    onRename={renameColumn}
                    onAddTask={addTask}
                    onDeleteTask={handleDelete}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          {newColumn ? (
            <div className="flex flex-col items-center w-72 h-full gap-2 bg-gray-200 p-3 rounded-lg">
              <input
                id="column"
                name="column"
                type="text"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                placeholder="Enter column name"
                className="bg-transparent px-2 py-1 rounded-md focus:outline-none "
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleAddColumn}
                  className="bg-transparent text-primaryDark px-4 py-2 hover:text-lightGreen"
                >
                  <TiTick />
                </button>
                <button
                  onClick={() => setNewColumn(false)}
                  className="bg-transparent text-primaryDark px-4 py-2 hover:text-priorityRed"
                >
                  <IoMdClose size={18} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setNewColumn(true)}
              className="bg-gray-300 text-primaryDark px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 h-4 w-4 flex items-center justify-center"
            >
              +
            </button>
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Page;
