import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#4CAF50', // Green color
  },
  [`& .${linearProgressClasses.dashed}`]: {
    backgroundImage: `radial-gradient(${theme.palette.grey[theme.palette.mode === 'light' ? 300 : 700]} 1px, transparent 1px)`, // Darker grey color
    backgroundSize: '3px 3px',
  },
}));

export default function CustomizedProgressBars({ value }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography>Chance of success</Typography>
        <Box sx={{ width: '70%', mt: 1, mb: 1 }}>
          <BorderLinearProgress variant="determinate" value={value} />
        </Box>
        <Typography>{value}% </Typography>
      </Stack>
    </Box>
  );
}
