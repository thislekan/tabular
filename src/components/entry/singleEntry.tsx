import { SetStateAction, useEffect, useState } from "react";
import { IEntry } from "../table/interface";
import { makeRequest } from "../../utils/calls";
import { IFetchResults } from "../../utils/interfaces";

interface IViewEntry {
  entry: IEntry | null;
  closePortal: () => void;
}

const listOfUndos: { entry: IEntry | null; task: string }[] = [];
const listOfRedos: any[] = [];
const baseUrl = "https://62a6bb9697b6156bff7e6251.mockapi.io/v1/";
const ViewEntry = (props: IViewEntry): JSX.Element => {
  const { name, updatedAt, createdAt, description, type, id } =
    props.entry || {};
  const [data, setData] = useState<IEntry | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [undoCompleted, setUndoCompleted] = useState(false);

  useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        const result: IFetchResults = await makeRequest({
          url: `${baseUrl}apis/${id}`,
        });
        if (result.name) setData(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentData();
    console.log({ editCompleted });
  }, [editCompleted, id]);
  const handleClick = () => {
    props.closePortal();
    setEditCompleted(false);
  };
  const toggleEditMode = () => setEditMode(!editMode);
  const handleInput = (e: { target: { value: SetStateAction<string> } }) => {
    setDescriptionValue(e.target.value);
  };
  const formatUndos = (task: string) => {
    const undoTask = { entry: props.entry, task, type: "UNDO" };
    listOfUndos.push(undoTask);
    sessionStorage.setItem("undos", JSON.stringify(listOfUndos));
  };

  const submitEdit =
    (overrideId?: string, overrideDescription?: string) => async () => {
      if (!descriptionValue.length)
        return alert("Description cannot be empty!");
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
          formatUndos("EDIT");
          setEditCompleted(!editCompleted);
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
      const list = JSON.parse(sessionStorage.getItem("undos")!);
      const item = list.pop();
      listOfRedos.push(item);
      await submitEdit(item.entry.id, item.entry.description)();
      setDescriptionValue(item.entry.description);
      sessionStorage.setItem("undos", JSON.stringify(list));
      sessionStorage.setItem("redos", JSON.stringify(listOfRedos)!);
      setUndoCompleted(true);
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Cannot undo this operation!");
    }
  };

  const redoFunc = async () => {
    try {
      const list = JSON.parse(sessionStorage.getItem("redos")!);
      const item = list.pop();
      listOfUndos.push(item);
      await submitEdit(item.entry.id, item.entry.description)();
      setDescriptionValue(item.entry.description);
      sessionStorage.setItem("redos", JSON.stringify(list));
      sessionStorage.setItem("undos", JSON.stringify(listOfUndos));
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
              description:{" "}
              {!data ? description : descriptionValue || data.description}
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
          {!descriptionValue.length ? (
            <>
              <button className="btn" onClick={toggleEditMode}>
                {!editMode ? "Edit" : "Cancel Edit"}
              </button>
              <button className="btn" onClick={deleteEntry}>
                Delete
              </button>
            </>
          ) : (
            <button onClick={submitEdit()}>Submit</button>
          )}
          {editCompleted && <button onClick={undoFunc}>Undo</button>}
          {undoCompleted && <button onClick={redoFunc}>Redo</button>}
        </div>
      </div>
    </div>
  );
};

export default ViewEntry;
