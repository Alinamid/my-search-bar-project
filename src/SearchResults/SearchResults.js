// src/components/SearchResults.js
import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      <p>Results: {results.length}</p>
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
