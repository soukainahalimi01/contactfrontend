import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from './auth/Signup';
import Login from './auth/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardLayout from './DashboardLayout';
import Contact from './auth/Contact';
import Users from './Users';
import Profil from "./auth/Profil";
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{
      background: 'linear-gradient(58deg,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 53%,rgba(255,160,71,1) 100%)',
      minHeight: "100vh"
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/contacts" />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="/connexion" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/contacts" element={<Contact />} />
              <Route path="/users"    element={<Users />} />
              {/* ✅ Profil dakhel hna */}
              <Route path="/profil"   element={<Profil />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;