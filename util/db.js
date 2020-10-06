const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "max-node",
  password: "owS@q4hWyxGId-0SeLYd0jUp9AB ",
});

module.exports = pool.promise();
