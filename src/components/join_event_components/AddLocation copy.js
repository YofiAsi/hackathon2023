import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import { Button, Card, Fade, CardContent, DialogTitle, Grow, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MovingIcon from '@mui/icons-material/Moving';
import LoadingButton from '@mui/lab/LoadingButton';
import './Cards.css'
import { Stack } from '@mui/system';

const MapDialog = ({onLocationSaved, onSubmit}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Get user's location using Geolocation API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      error => {
        console.error(error);
        // If user location is not available, set default location to Tel Aviv
        setUserLocation({
          lat: 32.0853,
          lng: 34.7818
        });
      }
    );
  }, []);

  const handleMapClick = event => {
    const geocoder = new window.google.maps.Geocoder();
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    geocoder.geocode({ location: location }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const locationData = {
            lat: location.lat,
            lng: location.lng,
            address: results[0].formatted_address
          };
          setLocationMap(locationData);
          setSelectedLocation(location);
        }
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  };

  const handleSubmitClick = () => {
    setButtonLoading(true);
    onSubmit();
  } ;

  return (
    <div>
      <Stack>
        <Card>
          <LoadScriptNext googleMapsApiKey="AIzaSyDm2WAYdOWzrwap1RBCocsBZi3fVfJWxKU">
              <GoogleMap
              mapContainerStyle={{ width: '100%', height: '500px' }}
              center={userLocation}
              zoom={17}
              onClick={handleMapClick}
              >
              {selectedLocation && (
                  <Marker position={selectedLocation} />
              )}
              </GoogleMap>
          </LoadScriptNext>
          <CardContent>
              {locationMap ? locationMap.address : null}
          </CardContent>
        </Card>

        <LoadingButton
          onClick={handleSubmitClick}
          endIcon={<MovingIcon />}
          disabled={locationMap ? false:true}
          loading={buttonLoading}
          loadingPosition="end"
          variant="contained"
          color="success"
          sx={{width: 'fit-content'}}
        >
          {
            buttonLoading ? ":)" : "Let's Go"
          }
        </LoadingButton>  
      </Stack>
    </div>
  );
};

export default MapDialog;
