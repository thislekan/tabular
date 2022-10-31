import { useContext } from "react";
import { TableContext } from "./context";
import CreateEntry from "./entry/createEntry";
import SearchComponent from "./search";
import Table from "./table";

const MainView = () => {
  const { activeTab, setActiveTab } = useContext(TableContext)!;
  const toggleTab = (tab: string) => () => setActiveTab(tab);

  return (
    <>
      <div className="tabs-div">
        <button onClick={toggleTab("tab-1")}>Home</button>
        <button onClick={toggleTab("tab-2")}>Create Entry</button>
      </div>
      {activeTab === "tab-1" ? (
        <div className="home">
          <SearchComponent />
          <div className="home__table">
            <Table />
          </div>
        </div>
      ) : (
        <CreateEntry />
      )}
    </>
  );
};

export default MainView;
