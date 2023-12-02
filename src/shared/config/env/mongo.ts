type MONGO = {
  url: string;
  dbName: string;
};

export const mongo: MONGO = {
  url: process.env.MONGO_URL,
  dbName: process.env.MONGO_DB_NAME,
};
