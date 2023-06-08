import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const libraries = []; // Add any additional libraries you need

export default function MyGoogleMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDm2WAYdOWzrwap1RBCocsBZi3fVfJWxKU",
    libraries: libraries
  });
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={center}
          zoom={10}
        >
          <Marker position={center} />
        </GoogleMap>
      )}
    </div>
  );
}
