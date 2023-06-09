import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import { Button, Card, Fade, CardContent, DialogTitle, Grow, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MovingIcon from '@mui/icons-material/Moving';
import LoadingButton from '@mui/lab/LoadingButton';
import './Cards.css'
import { Stack } from '@mui/system';

const MapDialog = ({onLocationSaved, onSubmit}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleAddLocation = () => {
    setSelectedLocation(null);
    setDialogOpen(true);
  };

  const handleMapClick = event => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  const handleSubmitClick = () => {
    setButtonLoading(true);
    onSubmit();
  } ;

  const handleSaveLocation = () => {
    if (selectedLocation) {
      // Use Google Geocoding API to get the address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: selectedLocation }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            const locationData = {
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
              address: results[0].formatted_address
            };
            setLocationMap(locationData);
            onLocationSaved(locationData); // Update the locationMap state
          }
        } else {
          console.error('Geocoder failed due to:', status);
        }
      });
    }
  
    setDialogOpen(false);
  };
  

  const handleClose = () => {
    setDialogOpen(false);
  };
  

  return (
    <div>
      <Stack>
        {locationMap ? (
          <Typography variant='body1'>
            {locationMap.address}
          </Typography>
        ):(
          null
        )}

        {locationMap ? (
            <LoadingButton
            onClick={handleSubmitClick}
            endIcon={<MovingIcon />}
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
        ):
        (
            <Button variant="contained" onClick={handleAddLocation}>Add location</Button>
        )}
      </Stack>
      
      {dialogOpen && (
            <Fade in={true}>
            <div className="base-card">
                <div className="overlay-background" />
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
                    <DialogTitle>Choose a location</DialogTitle>
                    <Button onClick={handleSaveLocation}>Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </CardContent>
            </Card>
            </div>
            </Fade>
      )}
    </div>
  );
};

export default MapDialog;
