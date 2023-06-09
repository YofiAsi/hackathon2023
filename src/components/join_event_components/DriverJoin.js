import React, { useEffect, useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Slider,
  Typography,
  Button,
  Box,
  Container,
  Icon,
  Stack,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  CardActions
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './DriverJoin.css';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import { fontSize } from '@mui/system';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DoneIcon from '@mui/icons-material/Done';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import MovingIcon from '@mui/icons-material/Moving';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';


const DriverJoin = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [passengerCount, setPassengerCount] = useState(1);
  const [chanceVal, setChanceval] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();


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

  const handleSliderChange = (event, newValue) => {
    setPassengerCount(newValue);
  };

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleSubmitClick = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      setDialogOpen(true);
    }, 1000);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <CSSTransition key={0} classNames="slide-left" timeout={300}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Stack spacing={4} sx={{ justifyContent: 'center' }}>
                <div>
                  {passengerCount < 10 ? (
                    <TimeToLeaveIcon
                      style={{ fontSize: '150px', transform: `scale(${iconSize})` }}
                    />
                  ) : (
                    <AirportShuttleIcon sx={{ fontSize: '150px' }} />
                  )}
                </div>
                <Typography variant="h6">How many passengers can join you?</Typography>
                <Slider
                  value={passengerCount}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                />
              </Stack>
            </Box>
          </CSSTransition>
        );

      case 1:
        return (
          <CSSTransition key={1} classNames="slide-right" timeout={300}>
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
                      {selectedLocation && <Marker position={selectedLocation} />}
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
                            backgroundColor: '#4CAF50',
                            margin: '0 auto',
                            width: 'fit-content'
                          }}
                        >
                          {buttonLoading ? ':)' : "Let's Go"}
                        </LoadingButton>
                      </div>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </div>
          </CSSTransition>
        );

      default:
        return null;
    }
  };

  const iconSize = 0.25 + passengerCount * 0.075; // Define the icon size based on passenger count

  return (
    <Container
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', paddingTop: 0, justifyContent: 'space-between' }}
    >
      <Stepper nonLinear activeStep={activeStep} sx={{ display: 'flex', marginBottom: 2 }}>
        <Step>
          <StepLabel>Car</StepLabel>
        </Step>
        <Step>
          <StepLabel>Location</StepLabel>
        </Step>
      </Stepper>

      <div style={{ width: '100%' }}>
        <TransitionGroup>{getStepContent(activeStep)}</TransitionGroup>
      </div>

      <IconButton onClick={activeStep === 0 ? () => { handleNext(); setLocationMap(null); setSelectedLocation(null); } : handleBack}>
        {activeStep ? (
          <ArrowBackIosNewIcon sx={{ fontSize: '50px' }} />
        ) : (
          <ArrowForwardIosIcon sx={{ fontSize: '50px' }} />
        )}
      </IconButton>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Your in!</DialogTitle>
        <Card>
          <CardContent>
            <Typography variant="body1">
              A day before the event we will match you with other passengers
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => (window.location.href = '/dashboard/home')}>Go Home</Button>
          </CardActions>
        </Card>
      </Dialog>
    </Container>
  );
};

export default DriverJoin;
