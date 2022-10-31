import { useContext } from "react";
import { TableContext } from "../context";

const SearchComponent = () => {
  const { inPageSearch, webSearch } = useContext(TableContext)!;

  return (
    <div className="search">
      <form onSubmit={webSearch}>
        <input
          type="text"
          name="search"
          onChange={inPageSearch}
          placeholder="Search by name or description"
        />
        <button type="submit">SEARCH</button>
      </form>
    </div>
  );
};

export default SearchComponent;
