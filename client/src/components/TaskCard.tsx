import React, { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { TiAttachment } from "react-icons/ti";
interface TaskCardProps {
  _id: string;
  title: string;
  dueDate: string;
  category: string;
  priority: string;
  attachment: string[];
  onDeleteTask: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  _id,
  title,
  dueDate,
  category,
  priority,
  attachment,
  onDeleteTask,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMenuOpen(false);
      }}
    >
      <div className="flex flex-row justify-between">
        <p className="text-sm font-bold">{title}</p>
        {attachment.length !== 0 ? <TiAttachment /> : null}
        {isHovered && (
          <div className="relative">
            <CiMenuKebab
              className="text-primaryDark cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md p-2 z-10">
                <button
                  className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this task?"
                      )
                    ) {
                      onDeleteTask(_id);
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                  onClick={() => alert("Edit Clicked")}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        {category && (
          <p className="flex justify-center items-center text-[11px] font-poppins rounded-md bg-lightDark py-1 px-2 h-5">
            {category}
          </p>
        )}
        {priority && (
          <p
            className={`flex justify-center items-center text-[10px] font-poppins  h-[16px] rounded-md ${
              priority.toLocaleLowerCase() === "high"
                ? "bg-priorityRed text-white w-[35px]"
                : priority === "medium"
                ? "bg-priorityMedium text-primaryDark w-[40px]"
                : "bg-priorityLow text-primaryDark w-[35px]"
            }`}
          >
            {priority}
          </p>
        )}
      </div>

      {dueDate && (
        <div className="flex justify-end mt-3">
          <p className="text-[11px] bg-lightGreen p-1 rounded-md font-poppins">
            {dueDate}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
