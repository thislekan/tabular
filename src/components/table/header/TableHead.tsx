import { useContext, useEffect, useState } from "react";
import { TableContext } from "../../context";

const Tablehead = () => {
  const { sortEntries } = useContext(TableContext)!;
  const [clickCount, setClickCount] = useState(0);
  const toggleSort = () => {
    console.log({ clickCount });
    switch (clickCount) {
      case 0:
        setClickCount(1);
        sortEntries("ASC");
        break;
      case 1:
        setClickCount(2);
        sortEntries("DESC");
        break;
      default:
        setClickCount(0);
        sortEntries();
        break;
    }
  };
  useEffect(() => {
    console.log(clickCount, "--after");
  }, [clickCount]);

  return (
    <thead>
      <tr>
        <td>S/No.</td>
        <td className="name-cell">
          Name{" "}
          <div className="arrows">
            {clickCount !== 1 && (
              <span className="arrow arrow--up" onClick={toggleSort}>
                &#10506;
              </span>
            )}
            {clickCount !== 2 && (
              <span className="arrow arrow--down" onClick={toggleSort}>
                &#10507;
              </span>
            )}
          </div>
        </td>
        <td>Description</td>
        <td>Type</td>
      </tr>
    </thead>
  );
};

export default Tablehead;
