import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
// import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

// ----------------------------------------------------------------------

const client = new ApolloClient({
  uri: 'https://snirbroshitau-didactic-palm-tree-74jw5j9p9x9fwqpv-5000.preview.app.github.dev/graphql',
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