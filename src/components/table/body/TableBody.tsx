import { useContext } from "react";
import TableCells from "./TableCells";
import { IFetchResults } from "../../../utils/interfaces";
import Portal from "../../portal";
import ViewEntry from "../../entry/singleEntry";
import { TableContext } from "../../context";

const TableBody = (): JSX.Element => {
  const {
    entries,
    showPortal,
    toggleEntryView,
    selectedData,
    isSearching,
    searchResults,
  } = useContext(TableContext)!;
  const data = isSearching ? searchResults : entries;
  return (
    <>
      <tbody>
        {data.length ? (
          data.map((entry: IFetchResults, index: number) => (
            <TableCells
              entry={{ ...entry, count: index + 1 }}
              handleCellClick={toggleEntryView}
              key={entry.name + entry.id}
            />
          ))
        ) : (
          <tr>
            <td colSpan={4}>
              No entries found yet. Please create new entries or go back to a
              previous page
            </td>
          </tr>
        )}
      </tbody>
      {showPortal && (
        <Portal>
          <ViewEntry entry={selectedData} closePortal={toggleEntryView} />
        </Portal>
      )}
    </>
  );
};

export default TableBody;
