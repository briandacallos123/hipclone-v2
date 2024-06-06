import React, { useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Geocode from 'react-geocode'; // Import geocoding library

const MapContainer = () => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 14.6080659, lng: 121.0005259 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [inpAddress, setInpAddress] = useState(null);
  console.log(inpAddress, 'HAHA')

  const onLoad = (map: any) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const handleAddressSearch = (address: string) => {
    console.log(address, '????')
    // Use Geocode library to convert address to coordinates
    Geocode?.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng, '_________________________________________________')
        setCenter({ lat, lng }); // Update map center
        setMarkerPosition({ lat, lng }); // Update marker position
      },
      (error) => {
        console.error('Error fetching coordinates: ', error);
      }
    );
  };


  return (
    <LoadScript googleMapsApiKey="AIzaSyBfeD60EqbUHeAdl7eLmAekqU4iQBKtzVk">
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
          setInpAddress(e.target.value)
          // console.log(e.target.value,'val')
        }}
      />

      <button onClick={() => {
        handleAddressSearch(inpAddress);
      }}>Search</button>
    </LoadScript>
  );
};

export default MapContainer;
