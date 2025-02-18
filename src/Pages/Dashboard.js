import React, { useState } from "react";
import "../Styles/App.css";
import MapComponent from "../Components/MapComponent";
import axios from "axios";
import SearchBar from "../Components/SearchBar";
import FilterOptions from "../Components/FilterOptions";
import ChartComponent from "../Components/PieChartComponent";
import { useNavigate } from "react-router-dom";
import LineChartComponent from "../Components/LineChartLiveComponent";

function Dashboard() {
  const [selectedArea, setSelectedArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [granularity, setGranularity] = useState("5T");
  const [dataLive, setDataLive] = useState([]);
  const [mapWrapperClass, setMapWrapperClass] = useState("map-wrapper");
  const [totalCountData, setTotalCountData] = useState([]);
  const navigate = useNavigate();

  let user_data = JSON.parse(localStorage.getItem("user_data"));
  console.log("changed", user_data.isChangedPassword);

  const changePassword = () => {
    if (user_data.isChangedPassword === false) {
      console.log("changed", user_data.isChangedPassword);
      navigate("/home");
    }
  };

  const fetchData = async (location) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/specific_data?location=${location}&startDateTime=${startDate}&endDateTime=${endDate}&interval=${granularity}&yesterday_data=${false}`
      );
      setDataLive(response.data);
      setMapWrapperClass("map-wrapper-alt");
    } catch (error) {
      console.error("error occurred during the fetching location", error);
    }
  };

  const fetchTotalCountData = async (location) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/data?location=${location}`
      );
      setTotalCountData(response.data);
    } catch (error) {
      console.error("error occurred during the fetching location", error);
    }
  };

  return (
    <div className="App">
      <div className="content">
        <div className="left-panel">
          <MapComponent
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            fetchData={fetchData}
            fetchTotalCountData={fetchTotalCountData}
          />
        </div>
        <div className="right-panel">
          <SearchBar
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
          />
          <FilterOptions
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            granularity={granularity}
            setGranularity={setGranularity}
            fetchData={() => fetchData(selectedArea)}
            fetchTotalCountData={() => fetchTotalCountData(selectedArea)}
          />
        </div>
      </div>
      {/* <div className="container mt-5"> */}
      <div className="row">
        <div className="col-md-4 ">
          <LineChartComponent data={totalCountData} liveData={false} />
        </div>
        <div className="col-md-4">
          <LineChartComponent
            data={dataLive}
            totalCountData={totalCountData}
            liveData={true}
          />
        </div>
        <div className="col-md-4">
          <ChartComponent dataLive={dataLive} />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default Dashboard;
