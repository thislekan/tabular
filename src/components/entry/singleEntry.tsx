import { BaseSyntheticEvent, useEffect, useState, useCallback } from "react";
import { IEntry } from "../table/interface";
import { makeRequest } from "../../utils/calls";
import { IFetchResults } from "../../utils/interfaces";

interface IViewEntry {
  entry: IEntry | null;
  closePortal: () => void;
}

const baseUrl = "https://62a6bb9697b6156bff7e6251.mockapi.io/v1/";
const ViewEntry = (props: IViewEntry): JSX.Element => {
  const { name, updatedAt, createdAt, description, type, id } =
    props.entry || {};
  const [data, setData] = useState<IEntry | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [editCompleted, setEditCompleted] = useState(false);
  const [undoCompleted, setUndoCompleted] = useState(false);

  const fetchCurrentData = useCallback(async () => {
    try {
      const result: IFetchResults = await makeRequest({
        url: `${baseUrl}apis/${id}`,
      });
      if (result.name) setData(result);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchCurrentData();
  }, [fetchCurrentData]);

  useEffect(() => {
    return () => {
      sessionStorage.clear();
    };
  }, []);

  const handleClick = () => props.closePortal();
  const toggleEditMode = () => setEditMode(!editMode);
  const handleInput = (e: BaseSyntheticEvent) => {
    setDescriptionValue(e.target.value);
  };

  const submitEdit = (entry?: IEntry) => async () => {
    const { id: overrideId, description: overrideDescription } = entry || {};
    if (!descriptionValue?.length) {
      return alert("Description cannot be empty!");
    }
    setEditMode(!editMode);
    try {
      const newValue = await makeRequest({
        url: `${baseUrl}apis/${overrideId || id}`,
        options: {
          method: "PUT",
          body: JSON.stringify({
            description: overrideDescription || descriptionValue,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      });

      if (newValue) {
        const undoList = JSON.parse(sessionStorage.getItem("undos")!) || [];
        undoList.push({
          entry: entry || props.entry,
          task: "EDIT",
          type: "UNDO",
        });
        sessionStorage.setItem("undos", JSON.stringify(undoList));
        // setDescriptionValue(newValue.description);
        setEditCompleted(!editCompleted);
        setData(newValue);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEntry = async () => {
    try {
      const result = await makeRequest({
        url: `${baseUrl}apis/${id}`,
        options: {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      });

      if (result) handleClick();
    } catch (error) {
      console.error(error);
    }
  };

  const undoFunc = async () => {
    try {
      const redos = JSON.parse(sessionStorage.getItem("redos")!) || [];
      const list = JSON.parse(sessionStorage.getItem("undos")!) || [];
      const item = list.pop();
      redos.push({
        entry: data,
        task: "EDIT",
        type: "REDO",
      });
      await submitEdit(item)();
      setDescriptionValue(item.entry.description);
      sessionStorage.setItem("undos", JSON.stringify(list));
      sessionStorage.setItem("redos", JSON.stringify(redos)!);
      setUndoCompleted(true);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Cannot undo this operation!");
    }
  };

  const redoFunc = async () => {
    // debugger;
    try {
      const undos = JSON.parse(sessionStorage.getItem("undos")!) || [];
      const list = JSON.parse(sessionStorage.getItem("redos")!);
      const item = list.pop();
      undos.push(item);
      await submitEdit(item)();
      setDescriptionValue(item.entry.description);
      sessionStorage.setItem("redos", JSON.stringify(list));
      sessionStorage.setItem("undos", JSON.stringify(undos));
      setUndoCompleted(false);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Cannot redo this operation!");
    }
  };

  return (
    <div className="entry">
      <div className="entry__container">
        <div className="entry__container__encloser" onClick={handleClick}>
          &#10540;
        </div>
        <div className="entry__container__content">
          <p>name: {!data ? name : data.name}</p>
          {!editMode ? (
            <p onClick={toggleEditMode} className="editable">
              description: {descriptionValue}
            </p>
          ) : (
            <p>
              description:{" "}
              <input
                type="text"
                name="description"
                onChange={handleInput}
                value={descriptionValue}
              />
            </p>
          )}
          <p>type: {!data ? type : data.type}</p>
          <p>createdAt: {!data ? createdAt : data.createdAt}</p>
          <p>updatedAt: {!data ? updatedAt : data.updatedAt}</p>
        </div>
        <div className="entry__container__footer">
          <button className="btn" onClick={toggleEditMode}>
            {!editMode ? "Edit" : "Cancel Edit"}
          </button>
          {!editMode && (
            <button className="btn" onClick={deleteEntry}>
              Delete
            </button>
          )}
          {editMode && <button onClick={submitEdit()}>Submit</button>}
          {editCompleted && <button onClick={undoFunc}>Undo</button>}
          {undoCompleted && <button onClick={redoFunc}>Redo</button>}
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
