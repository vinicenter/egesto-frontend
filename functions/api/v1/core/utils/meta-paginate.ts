export const getPaginateMeta = (total: number, perPage: number, page: number) => {
  return {
    totalPages: Math.ceil((total || 0) / perPage),
    totalItems: (total) || 0,
    hasMorePages: page < Math.ceil((total || 0) / perPage),
    page,
    perPage,
  }
}
