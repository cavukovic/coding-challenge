const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../data/db");
const queries = require("./queries");

const app = express();
const PORT = process.env.PORT || 5174;

app.use(bodyParser.json());
app.use(cors());

db.serialize(async () => {
  await queries.clearDatabase();
  await queries.createTables();
  await queries.fillDummyData();

  // Start the server after filling dummy data
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.get("/top-authors", (req, res) => {
  console.log("GET /top-authors");

  const { author_name } = req.query;
  if (author_name != "") {
    db.all(
      `SELECT * FROM authors WHERE name = "${author_name}";`,
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
    db.all(
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

// app.get("/author", async (req, res) => {
//   console.log("GET /author");
//   const { author_name } = req.query;
//   try {
//     const author = await queries.getAuthorByName(author_name);
//     if (!author) {
//       return res.status(404).json({ error: "Author not found" });
//     }
//     res.json(author);
//   } catch (error) {
//     console.error("Error fetching author:", error);
//     res.status(500).json({ error: "Failed to fetch author" });
//   }
// });

// // API endpoint to get top 10 performing authors
// app.get("/top-authors", (req, res) => {
//   console.log("GET /top-authors");
//   const { author_name } = req.query;
//   // If author_name parameter is provided, filter authors data
//   if (author_name) {
//     const author = authorsData.find((author) => author.name === author_name);
//     if (!author) {
//       return res.status(404).json({ error: "Author not found" });
//     }
//     //return res.json(author);
//   }

//   // If no author_name parameter provided, return top 10 performing authors
//   const topAuthors = authorsData.slice(0, 10);
//   return res.json(topAuthors);
// });

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
