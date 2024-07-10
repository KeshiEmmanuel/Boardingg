import { Column } from "../types/ColumnTypes";

interface Props {
  column: Column;
}

function ColumnContainer(props: Props) {
  const { column } = props;
  return <div>{column.title}</div>;
}

export default ColumnContainer;
