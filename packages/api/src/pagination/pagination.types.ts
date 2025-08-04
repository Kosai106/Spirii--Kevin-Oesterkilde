export type PaginationOptions = {
  page?: string | number;
  limit?: string | number;
};

export type PaginationMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};
