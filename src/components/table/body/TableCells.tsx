import { ITableCells } from "../interface";

const TableCells = ({ entry, handleCellClick }: ITableCells): JSX.Element => {
  const { name, count, description, type } = entry;
  return (
    <tr onClick={() => handleCellClick(entry)}>
      <td>{count}</td>
      <td>{name}</td>
      <td>{description}</td>
      <td>{type}</td>
    </tr>
  );
};

export default TableCells;
