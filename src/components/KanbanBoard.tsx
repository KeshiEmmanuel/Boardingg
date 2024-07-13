import { useMemo, useState } from "react";
import { Column, Id } from "../types/ColumnTypes";
import PlusIcons from "../icons/PlusIcons";
import ColumnContainer from "./ColumnContainer";
import { Task } from "../types/TasksTypes";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [columnName, setColumnName] = useState<string>("");
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col), [columns]);
  const [tasks, setTasks] = useState<Task[]>([]);
  function generateId() {
    return Math.floor(Math.random() * 10001);
  }
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `${columnName}`,
    };

    setColumns((prevColumn) => [...prevColumn, columnToAdd]);
    setColumnName("");
  }
  console.log(columns);
  console.log(columnName);

  function deleteColumn(id: Id) {
    setColumns((prevColumn) => {
      return prevColumn.filter((col) => col.id !== id);
    });

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
    /* 
    const filteredColumns = columns.filter((col) => col.id !== id)
    setColumns(filteredColumns)
    */
  }
  function deleteTask(id: Id) {
    const newTask = tasks.filter((task) => task.id !== id);
    setTasks(newTask);
  }
  function onDragStart(e: DragStartEvent) {
    console.log("DRAG START", e);
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  function onDragEnd(e: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    setColumns((prevColumns) => {
      const activeColumnIndex = prevColumns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = prevColumns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }
  function updateColumnName(id: Id, title: string) {
    const newColumnName = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumnName);
  }
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Edit Task`,
    };

    setTasks((task) => [...task, newTask]);
  }
  function updateTaskName(id: Id, content: string) {
    const newTaskName = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTaskName);
  }

  //onDragOver Function
  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] ">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  updateColumnName={updateColumnName}
                  deleteColumn={deleteColumn}
                  deleteTask={deleteTask}
                  updateTaskName={updateTaskName}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
            onClick={() => createNewColumn()}
            disabled={columnName.length <= 3}
          >
            <PlusIcons /> Add
            <input
              type="text"
              className="bg-transparent outline-none"
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Column Name"
            />
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateTaskName={updateTaskName}
                deleteTask={deleteTask}
                createTask={createTask}
                updateColumnName={updateColumnName}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}

            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTaskName={updateTaskName}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
