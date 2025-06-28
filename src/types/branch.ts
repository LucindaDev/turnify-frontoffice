export interface Table {
  id: number;
  branch_id: number;
  name: string;
  places: number;
  status: 'active' | 'inactive';
}

export interface Branch {
  id: number;
  company_id: number;
  name: string;
  location: string;
  opens_at: string;
  closes_at: string;
  total_tables: number;
  active_tables: number;
  status: string;
  images: string[];
}

export interface BranchFormValues {
  name: string;
  location: string;
  opens_at: string;
  closes_at: string;
  images: string[];
  tables: {
    name: string;
    places: number;
    status: 'active' | 'inactive';
  }[];
}

export interface LoadedBranch extends Branch {
  tables: Table[];
}
