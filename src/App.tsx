import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
// import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// ----------------------------------------------------------------------

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            {/* <StyledChart /> */}
            <Router />
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  );
}