import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Geocode from 'react-geocode'; // Import geocoding library

const MapContainer = () => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [markerPosition, setMarkerPosition] = useState(null);
  // const [inpAddress, setInpAddress] = useState(null);
  const inpAddress = useRef(null)

  const onLoad = (map:any) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const handleAddressSearch = (address:any) => {
    console.log(address,'address')
    // Use Geocode library to convert address to coordinates
    Geocode?.fromAddress(address).then(
      (response) => {
        console.log(response,'RESPONSE')
        const { lat, lng }:any = response.results[0].geometry.location;
        setCenter({ lat, lng }); // Update map center
        setMarkerPosition({ lat, lng }); // Update marker position
      },
      (error) => {
        console.error('Error fetching coordinates: ', error);
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAP_SECRET}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
      </GoogleMap>

      <input
        type="text"
        placeholder="Enter address"
        onChange={(e) => {
          inpAddress.current = e.target.value;
        }}
      />

      <button onClick={()=>{
        handleAddressSearch(inpAddress.current)
      }}>Search</button>
    </LoadScript>
  );
};

export default MapContainer;
