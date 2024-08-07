import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Geocode from 'react-geocode'; // Import geocoding library


type MapContainerProps = {
  address:Address
}
type Address = {
  lat:null | string;
  lng:null | string;
  reset?:boolean;
}

const MapContainer = ({reset, lat, lng}:Address) => {
  const [map, setMap] = useState(null);
  const [center, setCenter]:any = useState();

  const [markerPosition, setMarkerPosition] = useState(null);
  const [inpAddress, setInpAddress] = useState(null);

  const onLoad = useCallback((map: any) => {
    if(lat && lng){
      // setMap(map);
    }
  },[lat, lng])

//  console.log(reset,'RESETTTTTT?????????')

  useEffect(()=>{
    if(lat && lng){
      setCenter({
        lat,
        lng
      })
    }
  },[lat, lng])

  useEffect(()=>{
    if(reset){
      setCenter({
        lat:"",
        lng:""
      })
    }
  },[reset])

  const onUnmount = () => {
    // setMap(null);
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
        <Marker position={center} />
      </GoogleMap>

    </LoadScript>
  );
};

export default MapContainer;
