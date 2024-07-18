// FilterOptions.js
import React, {  useEffect } from 'react';

function FilterOptions({startDate,setStartDate,endDate,setEndDate,granularity,setGranularity,fetchData}) {

  useEffect(() => {
    // Ensure end date is greater than start date
    if (endDate && startDate > endDate) {
      setEndDate('');
    }
  },[startDate, endDate]);



  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="filter-options">
      <div className="date-time-inputs">
        <input
          type="datetime-local"
          value={startDate}
          min={today}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endDate}
          min={startDate}
          max={today}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="granularity-options">
        <label>
          <input
            type="radio"
            value="5T"
            checked={granularity === '5T'}
            onChange={() => setGranularity('5T')}
          />
          5 min
        </label>
        <label>
          <input
            type="radio"
            value="15T"
            checked={granularity === '15T'}
            onChange={() => setGranularity('15T')}
          />
          15 min
        </label>
        <label>
          <input
            type="radio"
            value="H"
            checked={granularity === 'H'}
            onChange={() => setGranularity('H')}
          />
          1 hour
        </label>
        <label>
          <input
            type="radio"
            value="D"
            checked={granularity === 'D'}
            onChange={() => setGranularity('D')}
          />
          1 day
        </label>
      </div>
      <button className="search-button" onClick={fetchData}>
        Search
      </button>
    </div>
  );
}

export default FilterOptions;
