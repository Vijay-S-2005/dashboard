import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default icon issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapComponent({ selectedArea, setSelectedArea, fetchData,fetchTotalCountData }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchAllAreaLocation = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/allAreasWithLocation");
        setLocations(response.data);
        // console.log("location", response.data);
      } catch (error) {
        console.error("error occurred during the fetching location", error);
      }
    };
    fetchAllAreaLocation();
  }, []); 

  return (
    
    <div className="map-wrapper">
      <MapContainer 
        center={[13.0827, 80.2707]} 
        zoom={13} 
        className="map-container"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {locations.map((location, index) => (
          <Marker 
            key={index}
            position={[location.latitiude, location.Longitude]}
            eventHandlers={{
              click: () => {
                setSelectedLocation([location.latitiude, location.Longitude]);
                setSelectedArea(location.area);
                fetchData(location.area);
                fetchTotalCountData(location.area) // Pass location.area directly
              },
            }}
          >
            <Popup>
              {location.area}
            </Popup>
          </Marker>
        ))}

        <UpdateMapView selectedLocation={selectedLocation} />
      </MapContainer>
      {/* {console.log("locationsss", locations)} */}
    </div>
  );
}

function UpdateMapView({ selectedLocation }) {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.setView(selectedLocation, 25);
    }
  }, [selectedLocation, map]);
  return null;
}

export default MapComponent;
