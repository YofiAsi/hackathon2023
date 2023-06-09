import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar } from '@mui/material';
import ResponsiveAppBar from './MainAppBar';
import { gql, useQuery } from '@apollo/client';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);


  // const { loading, error, data } = useQuery(gql`
  //   query {
  //     events {
  //       id
  //       name
  //     }
  //   }
  // `);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error : {error.message}</p>;

  // return data.events.map(({ id, name }) => (
  //   <div key={id}>
  //     <h3>{id}</h3>
  //     <h3>{name}</h3>
  //   </div>
  // ));

  return (
    <StyledRoot>
      
      <ResponsiveAppBar />
      
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
