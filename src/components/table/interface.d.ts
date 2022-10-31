export interface IEntry {
  description: string;
  name: string;
  type: string;
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  count?: string | number;
}

export interface ITableCells {
  entry: IEntry;
  handleCellClick: (data?: IEntry) => void;
}
