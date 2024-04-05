const sqlite3 = require("sqlite3").verbose();

const DB_FILE_PATH = "./data/Data.db";

const db = new sqlite3.Database(DB_FILE_PATH, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

module.exports = db;
