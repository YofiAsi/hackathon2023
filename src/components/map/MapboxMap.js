import React, { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

const MapboxMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="400px"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={setViewport}
      mapboxApiAccessToken="sk.eyJ1IjoiYXNhZnNoaWxvIiwiYSI6ImNsaW41NDU5cTBkN2czZGx3NDdqcTU0NXEifQ.jvNq4fFQycBdHyyk2ImGzg"
    >
      <Marker latitude={37.7577} longitude={-122.4376}>
        <div>Marker</div>
      </Marker>
    </ReactMapGL>
  );
};

export default MapboxMap;
