const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const queries = require("./queries");

const app = express();
const PORT = process.env.PORT || 5174;
const sqlite3 = require("sqlite3").verbose();
const DB_FILE_PATH = "./data/Data.db";
const dbPool = new sqlite3.Database(DB_FILE_PATH);

app.use(bodyParser.json());
app.use(cors());

async function initializeDatabase() {
  // on startup, clear the database, create the tables and fill with dummy data
  await queries.clearDatabase();
  await queries.createTables();
  await queries.fillDummyData();
}

initializeDatabase().then(() => {
  // Start the server after filling dummy data
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.get("/top-authors", (req, res) => {
  const { author_name } = req.query;
  let rows = [];

  // if the author name is not empty
  if (author_name != "") {
    // check if it exists

    // use parameterization to avoid against sql injection
    dbPool.all(
      `SELECT * FROM authors WHERE name = ?`,
      author_name,
      (error, rows) => {
        if (error || rows.length === 0) {
          console.error(`Error cannot find author ${author_name}`, error);
          return res
            .status(500)
            .json({ error: `Failed to find author ${author_name}` });
        } else {
          // that author exists, so execute the second query
          executeSecondQuery();
        }
      }
    );
  } else {
    // If author_name is empty, execute the second query directly
    executeSecondQuery();
  }

  function executeSecondQuery() {
    dbPool.all(
      `SELECT a.name, SUM(si.item_price * si.quantity) AS total_revenue
          FROM authors a
          JOIN books b ON a.id = b.author_id
          JOIN sale_items si ON b.id = si.book_id
          GROUP BY a.name
          ORDER BY total_revenue DESC
          LIMIT 10;`,
      (error, rows) => {
        if (error) {
          console.error("Error fetching top authors:", error);
          return res.status(500).json({ error: "Failed to fetch top authors" });
        } else {
          console.log("Top Authors:", rows);
          return res.json(rows);
        }
      }
    );
  }
});