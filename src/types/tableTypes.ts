
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface TableConfig {
  page: number;
  pageSize: number;
  sort?: SortConfig;
  filter?: {
    key: string;
    value: string;
  };
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface Column {
  key: string;
  label: string;
  sortable: boolean;
  filterable: boolean;
}
