import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from './auth/Signup';
import Login from './auth/Login';
import Contact from './auth/Contact';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/contact" />} />

        <Route path="/inscription" element={<Signup />} />
        <Route path="/connexion" element={<Login />} />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;