import {
  createContext,
  useEffect,
  useState,
  useCallback,
  BaseSyntheticEvent,
} from "react";
import { IEntry } from "../table/interface";
import { IFetchResults } from "../../utils/interfaces";
import { makeRequest } from "../../utils/calls";

interface ITableContext {
  children: React.ReactNode;
}

interface IPagination {
  page: number;
  limit: number;
}

interface ITableContextValues {
  showPortal: boolean;
  entries: IFetchResults[];
  toggleEntryView: (data?: IEntry) => void;
  sortEntries: (value?: string) => void;
  selectedData: IEntry | null;
  baseUrl: string;
  fetchData: () => void;
  webSearch: (event: React.SyntheticEvent) => void;
  inPageSearch: (event: BaseSyntheticEvent) => void;
  searchResults: IFetchResults[];
  isSearching: boolean;
  limit: number;
  page: number;
  setPagination: (value: IPagination) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const TableContext = createContext<ITableContextValues | null>(null);
export const TableContextProvider = ({ children }: ITableContext) => {
  const baseUrl = "https://62a6bb9697b6156bff7e6251.mockapi.io/v1/";
  const [showPortal, setShowPortal] = useState(false);
  const [selectedData, setSelectedData] = useState<IEntry | null>(null);
  const [entries, setEntries] = useState<IFetchResults[]>([]);
  const [searchResults, setSearchResults] = useState<IFetchResults[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [{ limit, page }, setPagination] = useState({ limit: 10, page: 1 });
  const [activeTab, setActiveTab] = useState("tab-1");
  const prefferedEntryList = isSearching ? searchResults : entries;

  const fetchData = useCallback(async () => {
    try {
      const data: IFetchResults[] = await makeRequest({
        url: `${baseUrl}apis?page=${page}&limit=${limit}`,
      });
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  }, [limit, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortEntries = (order?: string) => {
    if (!order) return fetchData();
    const sorted = prefferedEntryList.sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return -1;
    });
    setEntries(order === "ASC" ? [...sorted] : [...sorted].reverse());
  };

  const toggleEntryView = (value?: IEntry) => {
    const appDiv: HTMLDivElement = document.querySelector(".App")!;
    if (value) {
      setSelectedData(value);
      setShowPortal(true);
      appDiv.style.overflowY = "hidden";
    } else {
      setSelectedData(null);
      setShowPortal(false);
      appDiv.style.overflowY = "unset";
    }
  };

  const inPageSearch = (e: BaseSyntheticEvent) => {
    const value = e.target.value.trim();
    if (!value) {
      setIsSearching(false);
      return setSearchResults([]);
    }

    setSearchTerm(value);
    setIsSearching(true);
    const results = entries.filter(
      (entry) => entry.name.includes(value) || entry.description.includes(value)
    );
    if (results.length) setSearchResults(results);
    if (!results.length && searchResults) setSearchResults([]);
  };

  const webSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(searchTerm);
    const results = await makeRequest({
      url: `${baseUrl}apis?keyword${encoded}`,
    });
    setIsSearching(true);
    if (results.length) setSearchResults(results);
  };

  return (
    <TableContext.Provider
      value={{
        showPortal,
        sortEntries,
        toggleEntryView,
        selectedData,
        fetchData,
        baseUrl,
        entries,
        webSearch,
        inPageSearch,
        searchResults,
        isSearching,
        limit,
        page,
        setPagination,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
