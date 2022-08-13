const { Client } = require("pg");
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "1324123a",
  database: "servisim",
});

module.exports = client;
