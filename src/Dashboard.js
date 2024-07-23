import React, { useState } from 'react';
import './App.css';
import MapComponent from './MapComponent';
import axios from 'axios';
import SearchBar from './SearchBar';
import FilterOptions from './FilterOptions';
// import HandleData from './HandleData';
import ChartComponent from './PieChartComponent';
import LineChartComponent from './LineChartLiveComponent';

function Dashboard() {
 
  
  const [selectedArea, setSelectedArea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [granularity, setGranularity] = useState('5T');
  const [dataLive, setDataLive] = useState([]);
  const [totalCountData,setTotalCountData] = useState([]);

  const fetchData = async (location) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/specific_data?location=${location}&startDateTime=${startDate}&endDateTime=${endDate}&interval=${granularity}&yesterday_data=${false}`);
      // console.log("response", response.data);
      setDataLive(response.data);
    } catch (error) {
      console.error("error occurred during the fetching location", error);
    }
  }

  const fetchTotalCountData = async (location) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/data?location=${location}`);
      setTotalCountData(response.data);
    }catch(error){
      console.error("error occurred during the fetching location", error);
    }
  } 

  return (
    <div className="App">
      <div className="content">
        <div className="left-panel">
          <MapComponent selectedArea={selectedArea} setSelectedArea={setSelectedArea} fetchData={fetchData} fetchTotalCountData={fetchTotalCountData} />
          {/* {console.log("areaaa", selectedArea)} */}
        </div>
        <div className="right-panel">
          <SearchBar selectedArea={selectedArea} setSelectedArea={setSelectedArea} />
          {/* {console.log("area", selectedArea)} */}
          <FilterOptions startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} granularity={granularity} setGranularity={setGranularity} fetchData={() => fetchData(selectedArea)} fetchTotalCountData={()=> fetchTotalCountData(selectedArea)} />


          {/* <HandleData dataLive={dataLive} /> */}
        </div>
      </div>
      <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <LineChartComponent  data={totalCountData} liveData={false}/>
        </div>
        <div className="col-md-4">
          {/* <ChartComponent type="line" dataLive={dataLive} /> */}
          <LineChartComponent  data={dataLive} totalCountData={totalCountData} liveData={true}/>
        </div>
        <div className="col-md-4">
          <ChartComponent  dataLive={dataLive} />
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;



