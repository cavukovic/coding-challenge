import React, { useState } from "react";
import NavBar from "./NavBar";
import leftArrow from "./assets/arrow-left-short.svg";
import xcircle from "./assets/x-circle-fill.svg";

const App = () => {
  const [authorName, setAuthorName] = useState("");
  const [topAuthors, setTopAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [error, setError] = useState("");

  const handleAuthorNameChange = (event) => {
    setAuthorName(event.target.value);
  };

  const clearAuthors = () => {
    setTopAuthors([]);
    setError("");
    console.log("clear authors");
  };

  const handleSearch = () => {
    // Make an HTTP GET request to the server endpoint
    fetch(`http://localhost:5174/top-authors?author_name=${authorName}`)
      .then((response) => {
        // Check if the response is successful (status code 2xx)
        if (!response.ok) {
          throw new Error("Failed to fetch top authors");
        }
        // Parse the JSON response
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched top authors
        console.log("update top authors");
        console.log(data);
        setTopAuthors(data);
        setError("");
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch operation
        console.error("Error fetching top authors:", error);
        setError("Failed to fetch top authors");
        setTopAuthors([]);
      });
  };

  const handleAuthorClick = (author) => {
    setSelectedAuthor(author);
  };

  return (
    <div>
      <NavBar></NavBar>
      <div className="page-container">
        {topAuthors.length < 1 && (
          <div className="input-and-button">
            <input
              type="text"
              placeholder="Enter team members name"
              value={authorName}
              onChange={handleAuthorNameChange}
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        )}
        {error && <div>{error}</div>}
        {topAuthors.length > 0 && (
          <div className="list-container">
            <div className="list-heading">
              <div className="left">
                <img src={leftArrow} alt="left arrow" onClick={clearAuthors} />
              </div>
              <h2 className="list-heading-text">{`You have ${topAuthors.length} Team Members`}</h2>
              <div className="right"></div>
            </div>
            <ul className="member-list">
              {topAuthors.map((author, index) => (
                <li key={index} onClick={() => handleAuthorClick(author)}>
                  <div className="name-and-text">
                    <img
                      height="60px"
                      width="60px"
                      src="https://picsum.photos/50/50"
                    />
                    <div>
                      <p className="name-text">{author.name}</p>
                      <p className="revenue-text">
                        Total Revenue ${author.total_revenue}
                      </p>
                    </div>
                  </div>
                  <img className="xcircle" src={xcircle} alt="x" />
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedAuthor && (
          <div>
            <h2>{selectedAuthor.name}</h2>
            <p>Total Revenue: {selectedAuthor.total_revenue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
