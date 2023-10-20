import React from 'react';
import "./SearchResults.css";

const SearchResults = ({ results, searchTimeInSeconds}) => {
  return (
    <div className="search-results">
      {results.length > 0 && (
        <div className="results-in-time">
          Found {results.length} result(s) in {searchTimeInSeconds} seconds
        </div>
      )}
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <a href={result.link} target="_blank" rel="noopener noreferrer">
            <h3>{result.title}</h3>
          </a>
          <p>{result.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
