import mysql from "mysql2/promise";

let connection;

export const connectMySQL = async () => {
  connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
};

export const getMySQLConnection = () => {
  if (!connection) throw new Error("MySQL connection not initialized");
  return connection;
};
