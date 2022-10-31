import { BaseSyntheticEvent, useContext } from "react";
import { TableContext } from "../../context";
import debounceFn from "../../../utils/debounce";

const TableFooter = () => {
  const { limit, page, setPagination, entries, searchResults } =
    useContext(TableContext)!;
  const shortData = entries.length < limit && searchResults.length < limit;

  const handlePageInput = (e: BaseSyntheticEvent) => {
    const { value = 1 } = e.target;
    setPagination({ page: Number(value), limit });
  };

  const handleLimitInput = (e: BaseSyntheticEvent) => {
    const { value } = e.target;
    setPagination({ page, limit: value });
  };

  const paginateFunc = (move: string) => () => {
    const value = move === "prev" ? page - 1 : page + 1;
    const setLimit = () => setPagination({ limit, page: Number(value) });
    debounceFn(setLimit, 200);
  };
  return (
    <tfoot>
      <tr>
        <td colSpan={5}>
          <div className="footer">
            <div className="footer__limit">
              <p>Limit</p>
              <input
                type="number"
                name="limit"
                id="limit"
                value={limit}
                onChange={handleLimitInput}
              />
            </div>
            <div className="footer__page">
              {page > 1 && (
                <div
                  className="footer__page__left btn"
                  onClick={paginateFunc("prev")}
                >
                  <p>Prev</p>
                  <span>&#8676;</span>
                </div>
              )}
              <div className="footer__page__middle page">
                <input
                  type="number"
                  name="page"
                  id="page"
                  value={page}
                  onChange={handlePageInput}
                  disabled
                />
              </div>
              {!shortData && (
                <div
                  className="footer__page__right btn"
                  onClick={paginateFunc("next")}
                >
                  <p>Next</p>
                  <span>&#8677;</span>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
};

export default TableFooter;
