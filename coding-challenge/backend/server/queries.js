const db = require("../data/db");

async function clearDatabase() {
  try {
    await db.exec(`
        -- Drop all tables
        DROP TABLE IF EXISTS sale_items;
        DROP TABLE IF EXISTS books;
        DROP TABLE IF EXISTS authors;
      `);
    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

async function createTables() {
  db.exec(`
            CREATE TABLE IF NOT EXISTS authors (
                id INTEGER PRIMARY KEY,
                name TEXT,
                email TEXT,
                date_of_birth TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY,
                author_id INTEGER REFERENCES authors(id),
                isbn TEXT
            );

            CREATE TABLE IF NOT EXISTS sale_items (
                id INTEGER PRIMARY KEY,
                book_id INTEGER REFERENCES books(id),
                customer_name TEXT,
                item_price MONEY,
                quantity INTEGER
            );
        `);
  console.log("Tables created successfully.");
}

// Function to fill tables with dummy data
async function fillDummyData() {
  try {
    await db.exec(`
    INSERT INTO authors (name, email, date_of_birth) VALUES
    ('John Doe', 'john@example.com', '1990-01-01'),
    ('Jane Smith', 'jane@example.com', '1985-05-15'),
    ('Alice Johnson', 'alice@example.com', '1978-11-30'),
    ('Michael Brown', 'michael@example.com', '1982-08-20'),
    ('Sarah Wilson', 'sarah@example.com', '1976-04-10'),
    ('David Lee', 'david@example.com', '1995-12-25'),
    ('Emily Taylor', 'emily@example.com', '1988-09-17'),
    ('Christopher Clark', 'chris@example.com', '1973-03-05'),
    ('Jessica Martinez', 'jessica@example.com', '1992-06-29'),
    ('Daniel Rodriguez', 'daniel@example.com', '1980-10-12'),
    ('Ashley Garcia', 'ashley@example.com', '1983-07-08'),
    ('Matthew Hernandez', 'matthew@example.com', '1998-02-14'),
    ('Amanda Gonzalez', 'amanda@example.com', '1979-11-22'),
    ('Justin Perez', 'justin@example.com', '1991-08-03'),
    ('Laura Flores', 'laura@example.com', '1987-05-18');

    INSERT INTO books (author_id, isbn) VALUES
    (1, '1234567890'),
    (2, '2345678901'),
    (3, '3456789012'),
    (4, '4567890123'),
    (5, '5678901234'),
    (6, '6789012345'),
    (7, '7890123456'),
    (8, '8901234567'),
    (9, '9012345678'),
    (10, '0123456789'),
    (11, '9876543210'),
    (12, '8765432109'),
    (13, '7654321098'),
    (14, '6543210987'),
    (15, '5432109876');

    INSERT INTO sale_items (book_id, customer_name, item_price, quantity) VALUES
    (1, 'Customer A', 25.99, 2),
    (2, 'Customer B', 19.99, 1),
    (3, 'Customer C', 35.50, 3),
    (4, 'Customer D', 22.50, 2),
    (5, 'Customer E', 18.75, 1),
    (6, 'Customer F', 27.80, 3),
    (7, 'Customer G', 30.00, 2),
    (8, 'Customer H', 15.00, 1),
    (9, 'Customer I', 28.99, 3),
    (10, 'Customer J', 21.50, 2),
    (11, 'Customer K', 24.75, 1),
    (12, 'Customer L', 33.25, 3),
    (13, 'Customer M', 20.00, 2),
    (14, 'Customer N', 17.99, 1),
    (15, 'Customer O', 29.50, 3);
  `);

    console.log("Dummy data inserted successfully.");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    throw error;
  }
}

async function getTopAuthors() {
  //   db.all("SELECT * FROM authors", (error, rows) => {
  //     rows.forEach((row) => console.log(`${row.name}`));
  //   });
  try {
    const result =
      await db.all(`SELECT a.name, SUM(si.item_price * si.quantity) AS total_revenue
          FROM authors a
          JOIN books b ON a.id = b.author_id
          JOIN sale_items si ON b.id = si.book_id
          GROUP BY a.name
          ORDER BY total_revenue DESC
          LIMIT 10;`);
    return result;
  } catch (error) {
    console.error("Error fetching top authors:", error);
    throw error;
  }
}

async function queryDummyData() {
  try {
    const result = await db.all(`
        SELECT * FROM authors;
      `);
    console.log("Query result:");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error querying dummy data:", error);
    throw error;
  }
}

function getAuthorByName(authorName) {
  return db.oneOrNone("SELECT * FROM authors WHERE name = $1", authorName);
}

function selectAuthors() {
  return db.all(`SELECT * FROM authors`);
}

module.exports = {
  clearDatabase,
  createTables,
  fillDummyData,
  selectAuthors,
  getTopAuthors,
  getAuthorByName,
};
