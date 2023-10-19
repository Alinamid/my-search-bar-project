import React, { useState, useEffect } from 'react';
import SearchResults from '../SearchResults/SearchResults';
import './SearchBar.css'; 

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [autoCompleteItems, setAutoCompleteItems] = useState([]);
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  

  const localDBAutocomplete = [
    { title: 'Item 1', description: 'Description 1' },
    { title: 'Item 2', description: 'Description 2' },
    // ...
  ];

  const localDBResults = [
    { title: 'Result 1', description: 'Description 1', link: 'https://example.com/1' },
    { title: 'Result 2', description: 'Description 2', link: 'https://example.com/2' },
    // ...
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Use the selected item to query the second database (localDBResults)
    window.console.log('localDBResults', localDBAutocomplete);

    // Implement autocomplete logic
    const filteredItems = localDBAutocomplete.filter(item =>
      item.title.toLowerCase().startsWith(value.toLowerCase())
    ).slice(0, 10);

    setAutoCompleteItems(filteredItems);
  };

  const handleInputFocus = () => {
    // Show autocomplete items on input focus if available
    if (autoCompleteItems.length > 0) {
      setAutocompleteVisible(true);
    }
  };

  const handleAutocompleteItemClick = (item) => {
    setInputValue(item.title);
    // setAutoCompleteItems([]);
    setAutocompleteVisible(false);

    // Use the selected item to query the second database (localDBResults)
    const results = localDBResults.filter(result =>
      result.title.toLowerCase().includes(item.title.toLowerCase())
    );

    setSearchResults(results);
  };

  // const handleOutsideClick = (e) => {
  //   // Hide autocomplete items when clicking outside the search bar
  //   if (!e.target.closest('.search-bar')) {
  //     setAutocompleteVisible(false);
  //   }
  // }

  const handleInputBlur = () => {
    // Hide autocomplete items on input blur
    setAutocompleteVisible(false);
  };

  // useEffect(() => {
  //   document.addEventListener('click', handleOutsideClick);
  //   return () => {
  //     document.removeEventListener('click', handleOutsideClick);
  //   };
  // }, []); // Add an empty dependency array to ensure the event listener is added and removed properly


  return (
    <div className="search-bar">
      <i
        className="search-icon"
        onClick={() => setAutocompleteVisible(!autocompleteVisible)}
      >
        &#128269;
      </i>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            setAutocompleteVisible(true);
          }
        }}
        placeholder="Search..."
        autoFocus
      />
      <i
        className="clear-icon"
        style={{ display: inputValue ? 'block' : 'none' }}
        onClick={() => setInputValue('')}
      >
        &#10006;
      </i>
      {autocompleteVisible && (
        <ul className="autocomplete-list">
          {autoCompleteItems.map((item, index) => (
            <li key={index} onClick={() => handleAutocompleteItemClick(item)}>
              {item.title}
            </li>
          ))}
        </ul>
      )}
      <SearchResults results={searchResults} />
    </div>
  );
};

export default SearchBar;
