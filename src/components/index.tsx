import { TableContextProvider } from "./context";
import MainView from "./tab";

const HomePage = (): JSX.Element => {
  return (
    <TableContextProvider>
      <MainView />
    </TableContextProvider>
  );
};

export default HomePage;
