import React, { BaseSyntheticEvent, useState, useContext } from "react";
import { TableContext } from "../context";
import { makeRequest } from "../../utils/calls";

const CreateEntry = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const { baseUrl, setActiveTab } = useContext(TableContext)!;

  const handleInput = (inputName: string) => (e: BaseSyntheticEvent) => {
    const value = e.target.value;
    switch (inputName) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "type":
        setType(value);
        break;
      default:
        break;
    }
  };

  const postEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name && !description && !type)
      return alert("All values are needed to create an entry");

    try {
      const result = await makeRequest({
        url: `${baseUrl}apis`,
        options: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            type: type.trim(),
          }),
        },
      });
      if (result) {
        setActiveTab("tab-1");
        setName("");
        setDescription("");
        setType("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-entry">
      <div className="create-entry__wrapper">
        <form onSubmit={postEntry}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInput("name")}
            />
          </div>
          <div>
            <label htmlFor="description">description</label>
            <input
              type="text"
              name="description"
              value={description}
              onChange={handleInput("description")}
            />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <input
              type="text"
              name="type"
              value={type}
              onChange={handleInput("type")}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEntry;
