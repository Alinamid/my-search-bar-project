import React, { useState, useRef, useEffect } from 'react';
import SearchResults from '../SearchResults/SearchResults';
import './SearchBar.css';
import { localDBAutocomplete, localDBResults } from "../data";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [autoCompleteItems, setAutoCompleteItems] = useState([]);
  const [autoCompleteVisible, setAutoCompleteVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [localDBAutocompleteSave, setLocalDBAutocomplete] = useState(localDBAutocomplete);
  const [searchTimeInSeconds, setSearchTimeInSeconds] = useState(null);


  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();

    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setAutoCompleteVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAutocomplete = (value) => {
    const existingItemIndex = localDBAutocompleteSave.findIndex(
      (item) => item.title.toLowerCase() === value.toLowerCase()
    );

    let filteredItems;
    if (existingItemIndex !== -1) {
      const existingItem = localDBAutocompleteSave[existingItemIndex];
      filteredItems = [
        existingItem,
        ...localDBAutocompleteSave.slice(0, existingItemIndex),
        ...localDBAutocompleteSave.slice(existingItemIndex + 1),
      ];
    } else {
      filteredItems = localDBAutocompleteSave.filter(
        (item) =>
          item.title.toLowerCase().startsWith(value.toLowerCase()) ||
          item.title.toLowerCase().trim() === value.toLowerCase().trim()
      );
    }

    const slicedItems = filteredItems.slice(0, 10);

    setAutoCompleteItems(slicedItems.map((item, index) => ({ ...item, isRecent: index === 0 })));
    setAutoCompleteVisible(slicedItems.length > 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleAutocomplete(value);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      const searchStartTime= Date.now();

      const results = localDBResults.filter((result) =>
        result.title.toLowerCase().includes(inputValue.toLowerCase())
      );

      setSearchResults(results);
      setAutoCompleteVisible(false);

      const existingItemIndex = localDBAutocompleteSave.findIndex(
        (item) => item.title.toLowerCase().trim() === inputValue.toLowerCase().trim()
      );

      if (existingItemIndex !== -1) {
        const existingItem = localDBAutocompleteSave[existingItemIndex];
        const updatedAutocompleteList = [
          existingItem,
          ...localDBAutocompleteSave.slice(0, existingItemIndex),
          ...localDBAutocompleteSave.slice(existingItemIndex + 1),
        ];

        setAutoCompleteItems(updatedAutocompleteList);
        setLocalDBAutocomplete(updatedAutocompleteList);
      } else {
        const newAutocompleteItem = { title: inputValue };

        setAutoCompleteItems((prevItems) => [newAutocompleteItem, ...prevItems]);
        setLocalDBAutocomplete((prevAutocomplete) => [newAutocompleteItem, ...prevAutocomplete]);
      }

      const searchEndTime = Date.now();
      const timeInSeconds = searchEndTime && searchStartTime
      ? (searchEndTime - searchStartTime) / 1000
      : null;
      setSearchTimeInSeconds(timeInSeconds);
    }
  };

  const handleInputFocus = () => {
    setAutoCompleteVisible(true);
    handleAutocomplete(inputValue);
  };

  const handleAutocompleteItemClick = (item) => {
    const searchStartTime = Date.now();
    setInputValue(item.title);
    setAutoCompleteVisible(false);

    const results = localDBResults.filter((result) =>
      result.title.toLowerCase().includes(item.title.toLowerCase())
    );
    setSearchResults(results);
    const searchEndTime = Date.now();
    const timeInSeconds = (searchEndTime - searchStartTime) / 1000;
    setSearchTimeInSeconds(timeInSeconds);
  };

  const handleRemoveItemClick = (e, item) => {
    e.stopPropagation();
    const updatedAutocompleteList = localDBAutocompleteSave.filter(
      (autocompleteItem) => autocompleteItem.title !== item.title
    );

    setLocalDBAutocomplete(updatedAutocompleteList);
    setAutoCompleteItems(updatedAutocompleteList);
  };

  return (
    <div>
      <div className="search-bar">
        <i className="search-icon">&#128269;</i>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyUp={handleEnterKeyPress}
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
        {autoCompleteVisible && (
          <div ref={autocompleteRef}>
            <ul className="autocomplete-list">
              {autoCompleteItems.map((item, index) => (
                <li key={index} onClick={() => handleAutocompleteItemClick(item)}>
                  {item.isRecent ? (
                    <>
                      <i className="clock-icon">🕒</i>
                      {item.title}
                    </>
                  ) : (
                    <>
                      <i className="search-icon">🔍</i>
                      {item.title}
                    </>
                  )}
                  <div className="remove-button" onClick={(e) => handleRemoveItemClick(e, item)}>
                    Remove
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <SearchResults results={searchResults} searchTimeInSeconds={searchTimeInSeconds} />

    </div>
  );
};

export default SearchBar;
