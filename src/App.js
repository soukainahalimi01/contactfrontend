import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from './auth/Signup';
import Login from './auth/Login';
import Contact from './auth/Contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Contact />} />
        <Route path="/inscription" element={<Signup />} />
        <Route path="/connexion" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;