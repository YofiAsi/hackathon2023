import Home from './components/Pages/Home'
import JoinEvent from './components/Pages/JoinEvent'
import DashboardLayout from './components/dashboard/DashboardLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import Page404 from './components/Pages/Page404';
import MatchPage from './components/Pages/MatchPage';

export default function Router() {
  return (
    // <BrowserRouter>
      <Routes>
        <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />
        <Route
            path="/index.html"
            element={<Navigate to="/dashboard" />}
          />
        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        >
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/home" />}
            index
          />
          <Route
            path="home"
            element={<Home />}
          />
          <Route
            path='join_event'
            element={<JoinEvent/>}
          />
          <Route
            path="match"
            element={<MatchPage/>}
          />
          <Route
            path="event/:eventId"
            element={<JoinEvent />}
          />
        </Route>


        <Route
          path="404"
          element={<Page404 />}
        />
        {/* <Route
            path="*"
            element={<Navigate to="/404" />}
          />
        <Route
          path="*"
          element={<Navigate to="/404" />}
        /> */}
      </Routes>
  );
}