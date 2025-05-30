// production
export const dbConfig = {
  host: import.meta.env.AIVEN_DB_HOST,
  user: import.meta.env.AIVEN_DB_USER,
  password: import.meta.env.AIVEN_DB_PASSWORD,
  database: import.meta.env.AIVEN_DB_NAME,
  port: parseInt(import.meta.env.AIVEN_DB_PORT),
  ssl: {
    ca: import.meta.env.AIVEN_DB_CA_CERT,
    rejectUnauthorized: true,
  },
};

// testing
// export const dbConfig = {
//   host: import.meta.env.LOCAL_DB_HOST,
//   user: import.meta.env.LOCAL_DB_USER,
//   password: import.meta.env.LOCAL_DB_PASSWORD,
//   database: import.meta.env.LOCAL_DB_NAME,
// };
