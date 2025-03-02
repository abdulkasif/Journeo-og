const mysql = require("mysql2");
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
<<<<<<< HEAD
  port: process.env.DB_PORT
=======
>>>>>>> 98208a5f3f7e9bbc7eb344caff710d69a0a8cebc
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection is failed: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = db;
