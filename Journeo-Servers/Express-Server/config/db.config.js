const mysql = require("mysql2");
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Journeo",
  password: "kiruthi123",
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection is failed: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = db;
