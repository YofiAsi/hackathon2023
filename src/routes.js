import Home from './components/Pages/Home'
import DashboardLayout from './components/DashboardLayout'
import { Routes, Route, Navigate } from 'react-router-dom';


export default function Router() {
  return (
    // <BrowserRouter>
      <Routes>
        <Route
            path="/"
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
        </Route>
      </Routes>
  );
}