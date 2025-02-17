const db = require("../config/db.config.js");

const User = {
  getAllUsers: (callback) => {
    const query = "SELECT * FROM users";
    db.query(query, callback);
  },
  createUser: (userData, callback) => {
    const query =
      "INSERT INTO users (username, phonenumber, password) VALUES(?, ?, ?)";
    db.query(
      query,
      [userData.username, userData.phonenumber, userData.password],
      callback
    );
  },
  getUserByPhone: (phonenumber, callback) => {
    const query = "SELECT * FROM users WHERE phonenumber = ?";
    db.query(query, [phonenumber], (err, results) => {
      if (err) {
        console.error("Error fetching user by phonenumber:", err);
        return callback(err, null);
      }
      callback(null, results[0]); // Return the first match
    });
  },
};

module.exports = User;
