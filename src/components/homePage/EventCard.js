import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import React from 'react';
// @mui
import { random, clamp } from 'lodash';
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, CardActionArea, Grid, Avatar, Typography, Stack, CardContent, Grow, CircularProgress } from '@mui/material';

import SvgColor from '../svg-color/SvgColor';
import { useNavigate } from 'react-router-dom';
// import { useTimer } from 'react-timer-hook';
import PeopleIcon from '@mui/icons-material/People';
// import { createClient } from 'pexels';

// ----------------------------------------------------------------------

// const client = createClient('Y9u8WmqtGw5byBRfqAo3KXkYs9Lixx7K4gdI8eEYw7dpilWDWBUx4N0j');

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 100,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const EventCard = React.forwardRef(({ event, eventId, color , timeout}, ref) => {

  const { name, place, time, pic} = event;
  const index = 1;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPhoto = async () => {
  //     try {
  //       const response = await client.photos.show({ id: pictureId });
  //       setPhoto(response);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching photo:', error);
  //       setLoading(false);
  //     }
  //   };

  //   if (pictureId !== -1) {
  //     fetchPhoto();
  //   }
  // }, [pictureId]);

  // const time = new Date();
  // const diff = time - new Date(time_to_start * 1000);
  // const seconds = Math.abs(diff / 1000);
  // time.setSeconds(time.getSeconds() + seconds);

  // function MyTimer({ expiryTimestamp }) {
  //   const { seconds, minutes, isRunning } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  //   return (
  //     <div style={{ textAlign: 'center' }}>
  //       <div style={{ fontSize: '60', fontWeight: 'bold' }}>
  //         {diff < 0 && isRunning ? <div>Debate start in {minutes}:{seconds}</div> : 'Debate started'}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Grow in={true} timeout={timeout}>
      <div style={{ minWidth: '270px', width: '25%', padding: '6px' }}>
        <Card sx={{ position: 'relative', bgcolor: color }} ref={ref}>
          <CardActionArea
            onClick={() => {
              navigate(`/dashboard/event/${eventId}`);
            }}
          >
            <StyledCardMedia
              sx={{
                pt: 'calc(100% * 4 / 3)',
                '&:after': {
                  top: 0,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  backgroundColor: pic === -1 ? '' : 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay color
                },
              }}
            >
              <SvgColor
                color="paper"
                src="/assets/icons/shape-avatar.svg"
                sx={{
                  width: 80,
                  height: 36,
                  zIndex: 9,
                  bottom: -16,
                  position: 'absolute',
                  color: 'background.paper',
                }}
              />

              {pic !== -1 ? (
                <StyledCover alt={name} src={pic} />
        ) : (
                null
              )}
            </StyledCardMedia>

            <CardContent
              sx={{
                pt: 3,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            >
              <Stack spacing={1} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: '40%', overflow: 'hidden' }}>
                  <Typography
                    color="inherit"
                    variant="subtitle2"
                    underline="hover"
                    sx={{
                      ...((latestPostLarge || latestPost) && {
                        color: 'common.white',
                      }),
                      typography: 'h5',
                      height: 1,
                      fontSize: '1.2rem',
                    }}
                  >
                    {name}
                  </Typography>
                </Box>
                <Box sx={{ height: '30%', overflow: 'hidden' }}>
                <Typography
                    color="inherit"
                    variant="subtitle2"
                    underline="hover"
                    sx={{
                      ...((latestPostLarge || latestPost) && {
                        color: 'common.white',
                      }),
                      typography: 'h5',
                      height: 1,
                      fontSize: '1.2rem',
                    }}
                  >
                      {place}
                    </Typography>
                </Box>
                <Box sx={{ height: '30%', overflow: 'hidden' }}>
                <Typography
                    color="inherit"
                    variant="subtitle2"
                    underline="hover"
                    sx={{
                      ...((latestPostLarge || latestPost) && {
                        color: 'common.white',
                      }),
                      typography: 'h5',
                      height: 1,
                      fontSize: '1.2rem',
                    }}
                  >
                      {time}
                    </Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </Grow>
  );
});

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default EventCard;
