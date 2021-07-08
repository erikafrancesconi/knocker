import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DBCONN,
});
pool.on("connect", (client) => {
  console.log(client.processID, "Pool connected.");
});
pool.on("acquire", (client) => {
  console.log(client.processID, "Connection acquired from client.");
});
pool.on("remove", (client) => {
  console.log(client.processID, "Client removed.");
});
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err, client).processID;
  process.exit(-1);
});

export const connect = (err, client, release) => {
  return pool.connect(err, client, release);
};

export const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

export const end = () => {
  return pool.end();
};
