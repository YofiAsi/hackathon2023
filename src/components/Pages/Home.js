import React from 'react';
import { Grid, Button, Box, Skeleton, Paper, Container, Grow, TextField, Stack, Typography, Autocomplete } from '@mui/material';
// import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { random, clamp } from 'lodash';
import { alpha, styled } from '@mui/system';
// import useAuthentication from "../hooks/useAuthentication";
import RoomCard from '../homePage/RoomCard';

// ----------------------------------------------------------------------


const CardContainer = styled('div')({
  width: '100%',
  // overflowY: 'scroll',
  // scrollbarWidth: 'thin',
  // scrollbarColor: 'transparent transparent',
  padding: '0px', // Adjust the padding value as needed
  // boxSizing: 'border-box',
  
});

// ----------------------------------------------------------------------

const events = {
  0: {
    name: "Tuna & Ravid",
    place: "Live Park",
    time: "1st of July, 20:00",
    pic: "tuna",
  },

  1: {
    name: "Macabi Haifa vs. Macabi TLV",
    place: "Blumfield, TLV",
    time: "22nd of July, 19:00",
    pic: "football"
  },

  2: {
    name: "Noa Kirel",
    place: "Barbi, TLV",
    time: "1st of August, 20:30",
    pic: "noa",
  },
}


export default function Home() {
  const colors = [
    '#263238', // Dark Blue Grey
    '#9C27B0', // Deep Purple
    '#6A1B9A', // Dark Purple
    '#303F9F', // Indigo
    '#1A237E', // Midnight Blue
    '#004D40', // Dark Teal
    '#006064', // Dark Cyan
    '#01579B', // Dark Blue
    '#FF6F00', // Dark Orange
    '#E65100', // Dark Amber
  ];
  const getRandomColor = () => alpha(colors[random(0, colors.length - 1)], 0.72);  

  const [roomsData, setRoomsData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState(false);
  const [showCreateRoomCard, setShowCreateRoomCard] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const navigate = useNavigate();

  // const isAuthenticated = useAuthentication();
  // const socket = io('ws://' + window.location.hostname + ':8000');

  // const fetchRooms = async () => {
  //   socket.emit('fetch_all_rooms');
  // };

  // const handleKeyPress = (event) => {
  //   if (event.key === 'Escape') {
  //     setShowCreateRoomCard(false)
  //   }
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     fetchRooms();
  //     socket.on('all_rooms', (rooms) => {
  //       const mappedRooms = new Map(Object.entries(rooms));
  //       mappedRooms.forEach((data) => {
  //         data.color = getRandomColor(); // Add random color to each room
  //       });
  //       setRoomsData(mappedRooms);
  //     });
  //     socket.on('rooms_updated', () => {
  //       console.log('rooms updated');
  //       fetchRooms();
  //       // set roomsData to new data
  //     });
  //   };

  //   window.addEventListener('keydown', handleKeyPress);
  //   fetchData();

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log(roomsData);
  //   filterRooms('');
  // }, [roomsData]);

  // useEffect(() => {
  //   setShowLoginCard(!isAuthenticated);
  // }, [isAuthenticated]);

  const filterRooms = (query) => {
    const filtered = Array.from(roomsData).filter(([roomId, data]) => {
      const tags = data.tags || [];
      const name = data.name || '';
      const lowerQuery = query.toLowerCase();
      return tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) || name.toLowerCase().includes(lowerQuery);
    });
    setFilteredRooms(filtered);
  };

  return (
      <Container>
          <Stack spacing={2} alignItems="center" justifyContent="center"  mb={1}>
            <Stack spacing={2} mb={3} direction="row" alignItems="center" justifyContent="center" sx={{width:'100%'}}>
              <TextField
                label="Search for events"
                sx={{ width: '100%' }}
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  filterRooms(query);
                }}
                />
              
            </Stack>
            {roomsData ? (
              <CardContainer>
                <Grid container justifyContent="center">
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map(([roomId, data], index) => (
                      <RoomCard
                        key={`${roomId}-${searchQuery}`}
                        room={data}
                        roomId={roomId}
                        color={data.color}
                        timeout={(index + 1) * 250}
                        pictureId={data.pictureId}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ fontSize: '1rem', color: 'gray', marginTop: '100px' }}>
                      There are no rooms, maybe you should make one?
                    </Typography>
                  
                  )}
                </Grid>
              </CardContainer>
            ) : (
              <Stack spacing={4}>
                <Stack direction="row" spacing={4}>
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                </Stack>
                <Stack direction="row" spacing={4}>
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                  <Skeleton variant="rounded" width={200} height={270} animation="wave" />
                </Stack>
              </Stack>
            )}
          </Stack>
      </Container> 
  );
}
