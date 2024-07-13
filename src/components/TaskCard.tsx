import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import { Task } from "../types/TasksTypes";
import { Id } from "../types/ColumnTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface TaskCardProps {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTaskName: (id: Id, title: string) => void;
}
const TaskCard = (props: TaskCardProps) => {
  const { task, deleteTask, updateTaskName } = props;
  const [moveOver, setMoveOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  function toggleEditMode() {
    setEditMode((prevMode) => !prevMode);
    setMoveOver(false);
  }

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
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
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset border-rose-500 opacity-20 cursor-grab relative"
      ></div>
    );
  }
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={styles}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative opacity-50"
      >
        <textarea
          value={task.content}
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outine-none "
          onChange={(e) => updateTaskName(task.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={styles}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl  hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => setMoveOver(true)}
      onMouseLeave={() => setMoveOver(false)}
      onClick={() => setEditMode(true)}
    >
      <p className="my-auto w-full h-[90%] overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {/* {editMode && (
        <textarea
          value={task.content}
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outine-none"
          onChange={(e) => updateTaskName(task.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
        ></textarea>
      )} */}
      {moveOver && (
        <button
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
          onClick={() => deleteTask(task.id)}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
