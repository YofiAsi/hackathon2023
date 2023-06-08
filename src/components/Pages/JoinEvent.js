import { Container, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import PassengerJoin from '../join_event_components/PassengerJoin';
import DriverJoin from '../join_event_components/DriverJoin';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function JoinEvent() {
  const [pageState, setPageState] = useState(0);

  const handleDriverClick = () => {
    setPageState(1);
  };

  const handlePassengerClick = () => {
    setPageState(2);
  };

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      {pageState === 0 && (
        <Stack spacing={2}>
          <Typography variant="h6">Are you a driver or passenger?</Typography>
          <Stack direction={'row'} spacing={4} justifyContent="center">
            <IconButton onClick={handleDriverClick}>
              <DirectionsCarIcon sx={{ fontSize: 100 }}/>
            </IconButton>
            <IconButton onClick={handlePassengerClick}>
              <EmojiPeopleIcon sx={{ fontSize: 100 }}/>
            </IconButton>
          </Stack>
        </Stack>
      )}
      {pageState === 1 && <DriverJoin />}
      {pageState === 2 && <PassengerJoin />}
    </Container>
  );
}
