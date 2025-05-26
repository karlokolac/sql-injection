export const dbConfig = {
  host: import.meta.env.AIVEN_DB_HOST,
  user: import.meta.env.AIVEN_DB_USER,
  password: import.meta.env.AIVEN_DB_PASSWORD,
  database: import.meta.env.AIVEN_DB_NAME,
  port: parseInt(import.meta.env.AIVEN_DB_PORT || "3306"),
  ssl: {
    ca: import.meta.env.AIVEN_DB_CA_CERT,
    rejectUnauthorized: true,
  },
};
