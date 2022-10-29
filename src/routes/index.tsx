import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "../components";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
