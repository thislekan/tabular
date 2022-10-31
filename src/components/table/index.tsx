import TableFooter from "./footer/TableFooter";
import Tablehead from "./header/TableHead";
import TableBody from "./body/TableBody";

const Table = (): JSX.Element => {
  return (
    <table>
      <Tablehead />
      <TableBody />
      <TableFooter />
    </table>
  );
};

export default Table;
