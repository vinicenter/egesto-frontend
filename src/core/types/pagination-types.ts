export interface tableParams {
  page?: number,
  limit?: number,
  search?: string,
  orderBy?: string,
  order?: string,
}

export interface paginationRoot<T> {
  docs: T[],
  totalDocs: number,
  limit: number,
  totalPages: number,
  page: number,
  pagingCounter: number,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  prevPage: number | null,
  nextPage: number | null,
}
