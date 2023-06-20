import { initDatabase } from "mongo-http";

export const mongoInit = ({ env, request }) => {
  const headers = request.headers

  try {
    const db = initDatabase({
      appId: env.ATLAS_MONGO_HTTP_APP_ID,
      apiKey: env.ATLAS_MONGO_HTTP_API_KEY,
      databaseName: `${headers.get('x-tenant')}-${env.ENVIRONMENT}`,
      dataSource: env.ATLAS_MONGO_HTTP_DATA_SOURCE,
    });

    return db;
  } catch (error) {
    console.error(error);
  }
};

export const getPaginateMeta = (total: number, perPage: number, page: number) => {
  const totalPages = Math.ceil(total / perPage);
  const nextPage = page + 1 > totalPages ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;

  return {
    total,
    perPage,
    page,
    totalPages,
    nextPage,
    prevPage,
  };
}
