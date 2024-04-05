-- For the first question:
SELECT * FROM authors ORDER BY date_of_birth LIMIT 10;
-- explanation:
-- Uses the ORDER BY clause to sort the results by date of birth, then LIMIT to return the first 10 results


-- For the second question:
SELECT SUM(si.item_price * si.quantity) AS total_sales
FROM sale_items si
JOIN books b ON si.book_id = b.id
JOIN authors a ON b.author_id = a.id
WHERE a.name = 'Lorelai Gilmore';
-- explanation:
-- Uses the SUM function to calculate the total sales (item_price * quantity)
-- Uses the JOIN clause to join the sale_items table with the books table
-- using the book_id, then the authors table according to the author_id column in the books table.
-- Then uses the WHERE clause to filter the results by the name of the author.

-- For the third question:
SELECT a.name, SUM(si.item_price * si.quantity) AS total_revenue
FROM authors a
JOIN books b ON a.id = b.author_id
JOIN sale_items si ON b.id = si.book_id
GROUP BY a.name
ORDER BY total_revenue DESC
LIMIT 10;
-- explanation:
-- Uses the SUM function to calculate the total revenue (item_price * quantity)
-- JOINs the authors table with the books table using the author_id column in the books table
-- then the sale_items table using the book_id column in the books table
-- Uses the GROUP BY clause to group the results by the name of the author
-- ordered by the total revenue in descending order and limited to 10 results