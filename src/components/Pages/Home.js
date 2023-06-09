import React from 'react';
import { Grid, Button, Box, Skeleton, Paper, Container, Grow, TextField, Stack, Typography, Autocomplete, SpeedDial } from '@mui/material';
// import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { random, clamp } from 'lodash';
import { alpha, styled } from '@mui/system';
// import useAuthentication from "../hooks/useAuthentication";
import EventCard from '../homePage/EventCard';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { gql, useQuery, useMutation } from '@apollo/client';


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
    pic: "https://www.tmisrael.co.il/static/images/live/event/eventimages/MRL22_610x336_2023-03-20_201827.jpg",
  },

  1: {
    name: "Macabi Haifa vs. Macabi TLV",
    place: "Blumfield, TLV",
    time: "22nd of July, 19:00",
    pic: "https://icdn.psgtalk.com/wp-content/uploads/2022/09/fbl-eur-c1-maccabi-haifa-psg.jpg"
  },

  2: {
    name: "Noa Kirel",
    place: "Barbi, TLV",
    time: "1st of August, 20:30",
    pic: "https://www.israelhayom.com/wp-content/uploads/2022/02/15840314592828_b.jpg"
  },

  3: {
    name: "Bruno Mars",
    place: "Yarkon Park, TLV",
    time: "20th of October",
    pic: '/bruno.jpg'
  },

  4: {
    name: "Shahar Hasson",
    place: "Shuni, Binyamina",
    time: "3rd of November",
    pic: "/shahar.jpg",
  },

  5: {
    name: "Mac Ayres",
    place: "Barbi, TLV",
    time: "13th of November",
    pic: "/mac.jpg"
  }
};



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

  const [eventsData, setEventsData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(false);
  const [showCreateRoomCard, setShowCreateRoomCard] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const navigate = useNavigate();

  // this is just to show we can connect to the server
  const { loading, error, data } = useQuery(gql`
    query {
      events {
        id
        name
      }
    }
  `);

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

  useEffect(() => {
    const mappedEvents = new Map(Object.entries(events));
    mappedEvents.forEach((data) => {
      data.color = getRandomColor(); // Add random color to each room
    });
    setEventsData(mappedEvents);
  }, []);

  useEffect(() => {
    filterEvents('');
  }, [eventsData]);

  const filterEvents = (query) => {
    const filtered = Array.from(eventsData).filter(([eventId, data]) => {
      const name = data.name || '';
      const lowerQuery = query.toLowerCase();
      return name.toLowerCase().includes(lowerQuery);
    });
    setFilteredEvents(filtered);
  };


  // const [attendEvent, { data, loading, error }] = useMutation(gql`
  //   mutation AttendEvent(
  //     $userId: Int!
  //     $eventId: Int!
  //     $isDriver: Boolean!
  //     $capacity: Int!
  //     $pickUpLongtitude: Float!
  //     $pickUpLatitude: Float!
  //     $gender: Int!
  //   ) {
  //     attendEvent(
  //       userId: $userId
  //       eventId: $eventId
  //       isDriver: $isDriver
  //       capacity: $capacity
  //       pickUpLongtitude: $pickUpLongtitude
  //       pickUpLatitude: $pickUpLatitude
  //       gender: $gender
  //     ) {
  //       attendee {
  //         eventId
  //       }
  //     }
  //   }
  // `);

  // return <button onClick={() =>
  //   attendEvent({ variables: {
  //     eventId: 1,
  //     userId: 12,
  //     isDriver: false,
  //     capacity: 0,
  //     pickUpLongtitude: 30,
  //     pickUpLatitude: 30,
  //     gender: 1,
  //   } })
  // }>Attend Event</button>;


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
                  filterEvents(query);
                }}
                />
              
            </Stack>
            {eventsData ? (
              <CardContainer>
                <Grid container justifyContent="center">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(([roomId, data], index) => (
                      <EventCard
                        key={`${roomId}-${searchQuery}`}
                        event={data}
                        eventId={roomId}
                        color={data.color}
                        timeout={(index + 1) * 250}              
                      />
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ fontSize: '1rem', color: 'gray', marginTop: '100px' }}>
                      There are no events, maybe you should add one?
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
