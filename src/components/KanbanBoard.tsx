import { useState } from "react";
import { Column } from "../types/ColumnTypes";
import PlusIcons from "../icons/PlusIcons";
import ColumnContainer from "./ColumnContainer";

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [columnName, setColumnName] = useState<string>("");
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

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] ">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {columns.map((col) => (
            <ColumnContainer key={col.id} column={col} />
          ))}
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
            onInput={(e: React.FormEvent) => setColumnName(e.target.value)}
            placeholder="Column Name"
          />
        </button>
      </div>
    </div>
  );
}

export default KanbanBoard;
