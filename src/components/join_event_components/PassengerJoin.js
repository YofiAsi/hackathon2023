import React, { useEffect, useState } from 'react'
import CustomizedProgressBars from './BorderLinearProgress'
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import { Button, Container, Card, Fade, CardContent, DialogTitle, Grow, Typography, Stack, CardActions } from '@mui/material';
import MovingIcon from '@mui/icons-material/Moving';
import LoadingButton from '@mui/lab/LoadingButton';
import './Cards.css'

export default function PassengerJoin() {
  const [chanceVal, setChanceval] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationMap, setLocationMap] = useState(null);

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
    };
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
          const randomChance = Math.floor(Math.random() * (100 - 40 + 1) + 40);
          setChanceval(randomChance);
        }
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  };
  

  const handleSubmitClick = () => {
    setButtonLoading(true);
  } ;

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%', paddingTop: 0 }}>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography variant='h4'>
          Where do you want to get pick from?
        </Typography>

        <CustomizedProgressBars value={chanceVal}/>

        <div>
      <Stack spacing={2}>
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
            <Stack spacing={2}>
              <div>{locationMap ? locationMap.address : null}</div>
              <div>
              <LoadingButton
                onClick={handleSubmitClick}
                endIcon={<MovingIcon />}
                disabled={locationMap ? false : true}
                loading={buttonLoading}
                loadingPosition="end"
                variant="contained"
                sx={{
                  backgroundColor: '#4CAF50', // Change the background color to #4CAF50
                  margin: '0 auto',
                  width: 'fit-content'
                }}
              >
                {buttonLoading ? ":)" : "Let's Go"}
              </LoadingButton>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </div>

      </Stack>
    </Container>
  )
}
