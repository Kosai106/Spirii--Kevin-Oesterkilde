import {
  PaginationOptions,
  PaginationMeta,
  PaginatedResult,
} from './pagination.types';

export const paginate = <T>(
  items: T[],
  options: PaginationOptions = {},
): PaginatedResult<T> => {
  const { page = '1', limit = 1_000 } = options;

  const itemsPerPage = parseInt(String(limit), 10);
  const currentPage = parseInt(String(page), 10);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  const meta: PaginationMeta = {
    totalItems: items.length,
    itemCount: paginatedItems.length,
    itemsPerPage,
    totalPages: Math.ceil(items.length / itemsPerPage),
    currentPage,
  };

  return {
    items: paginatedItems,
    meta,
  };
};
