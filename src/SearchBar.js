import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

function SearchBar({selectedArea,setSelectedArea}) {

  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, { newValue }) => {
    setSelectedArea(newValue);
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/areas?q=${selectedArea}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => (
    <div>
      {suggestion}
    </div>
  );

  const inputProps = {
    placeholder: 'Search...',
    value:selectedArea,
    onChange: onChange
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    // Perform the map zoom operation using the suggestion data
    // onZoom(suggestion);
  };


  return (
    <div className="search-container">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={onSuggestionSelected} 
        inputProps={inputProps}
      />
    {/* {console.log(selectedArea)} */}
    </div>
  );
}

export default SearchBar;
