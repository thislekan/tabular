import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "../components";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
