import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon";
import { Column, Id } from "../types/ColumnTypes";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";

import PlusIcons from "../icons/PlusIcons";
import { Task } from "../types/TasksTypes";
import TaskCard from "./TaskCard";
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnName: (id: Id, title: string) => void;
  updateTaskName: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
}

function ColumnContainer(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumnName,
    createTask,
    tasks,
    deleteTask,
    updateTaskName,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const tasksID = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const styles = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={styles}
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-rose-600"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={styles}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col "
    >
      {/* {column.title} */}

      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none font-bold border-columnBackgroundColor border-4 flex items-center justify-between p-2"
      >
        <div className="flex gap-2 items-center ">
          <div className="flex justify-center items-center rounded-full bg-columnBackgroundColor px-2 py-1 text-sm">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateColumnName(column.id, e.target.value)}
              autoFocus
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
          onClick={() => deleteColumn(column.id)}
        >
          <DeleteIcon />
        </button>
      </div>
      {/* Column Task Container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {tasks.length < 1 && <p>No Tasks</p>}
        <SortableContext items={tasksID}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTaskName={updateTaskName}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column Footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor rounded-md p-4 border-x-columnBackgroundColor  hover:bg-mainBackgroundColor hover:text-rose-600 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcons /> Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;
