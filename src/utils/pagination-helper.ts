import {Document, Query} from "mongoose";

const paginateQuery = async <T extends Document>(mongoQuery: Query<T[], T>, page: number, limit: number) => {
  const skip = page - 1;
  return mongoQuery.skip(skip).limit(limit);
}

export default paginateQuery;
