export interface IFetchInputs {
  url: string!;
  options?: RequestInit;
}

export interface IFetchResults {
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  id: string;
  type: string;
}

export interface IFetchBody {
  name?: string;
  description?: string;
  type?: string;
}
