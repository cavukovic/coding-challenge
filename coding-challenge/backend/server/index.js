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
  console.log("GET /top-authors");

  const { author_name } = req.query;
  let rows = [];

  if (author_name != "") {
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
          // that author exists
          console.log("Author:", rows);
          // execute the second query
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

// this code also works with pooling but need to adjust behavior of searching a name that exists:
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const db = require("../data/db");
// const queries = require("./queries");

// const app = express();
// const PORT = process.env.PORT || 5174;

// app.use(bodyParser.json());
// app.use(cors());

// // Initialize database connection pool
// const sqlite3 = require("sqlite3").verbose();
// const DB_FILE_PATH = "./data/Data.db";
// const dbPool = new sqlite3.Database(DB_FILE_PATH);

// dbPool.serialize(async () => {
//   await queries.clearDatabase();
//   await queries.createTables();
//   await queries.fillDummyData();

// });

// // Define endpoint for fetching top authors
// app.get("/top-authors", async (req, res) => {
//   try {
//     const { author_name } = req.query;

//     let topAuthorsQuery = `
//       SELECT a.name, SUM(si.item_price * si.quantity) AS total_revenue
//       FROM authors a
//       JOIN books b ON a.id = b.author_id
//       JOIN sale_items si ON b.id = si.book_id
//     `;

//     if (author_name) {
//       topAuthorsQuery += `WHERE a.name = ?`;
//     }

//     topAuthorsQuery += `
//       GROUP BY a.name
//       ORDER BY total_revenue DESC
//       LIMIT 10;
//     `;

//     const params = author_name ? [author_name] : [];

//     const rows = await queryDatabase(topAuthorsQuery, params);

//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching top authors:", error);
//     res.status(500).json({ error: "Failed to fetch top authors" });
//   }
// });

// // Function to execute a parameterized query
// function queryDatabase(query, params) {
//   return new Promise((resolve, reject) => {
//     dbPool.all(query, params, (error, rows) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(rows);
//       }
//     });
//   });
// }

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const queries = require("./queries");

// const app = express();
// const PORT = process.env.PORT || 5174;

// app.use(bodyParser.json());
// app.use(cors());

// const sqlite3 = require("sqlite3").verbose();
// const DB_FILE_PATH = "./data/Data.db";
// const dbPool = new sqlite3.Database(DB_FILE_PATH);

// async function initializeDatabase() {
//   await queries.clearDatabase();
//   await queries.createTables();
//   await queries.fillDummyData();
// }

// initializeDatabase().then(() => {
//   // Start the server after filling dummy data
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });

// app.get("/top-authors", async (req, res) => {
//   console.log("GET /top-authors");

//   const { author_name } = req.query;

//   const topAuthorsQuery = `SELECT a.name, SUM(si.item_price * si.quantity) AS total_revenue
//     FROM authors a
//     JOIN books b ON a.id = b.author_id
//     JOIN sale_items si ON b.id = si.book_id
//     GROUP BY a.name
//     ORDER BY total_revenue DESC
//     LIMIT 10;`;

//   try {
//     if (author_name !== "") {
//       const author = await dbPool.get(
//         `SELECT * FROM authors WHERE name = ?`,
//         author_name
//       );

//       console.log("Author:", author);
//       if (!author) {
//         return res
//           .status(500)
//           .json({ error: `Author name ${author_name} not found` });
//       }
//     }

//     //rows = await dbPool.all(topAuthorsQuery);
//     dbPool.all(
//       `SELECT a.name, SUM(si.item_price * si.quantity) AS total_revenue
//                 FROM authors a
//                 JOIN books b ON a.id = b.author_id
//                 JOIN sale_items si ON b.id = si.book_id
//                 GROUP BY a.name
//                 ORDER BY total_revenue DESC
//                 LIMIT 10;`,
//       (error, rows) => {
//         if (error) {
//           console.error("Error fetching top authors:", error);
//           return res.status(500).json({ error: "Failed to fetch top authors" });
//         } else {
//           console.log("Top Authors:", rows);
//           return res.json(rows);
//         }
//       }
//     );

//     //console.log("Top Authors:", rows);
//     //return res.json(rows);
//   } catch (error) {
//     console.error("Error fetching top authors:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });
