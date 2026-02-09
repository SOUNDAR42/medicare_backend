
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/hospital" element={<HospitalDashboard />} />
          <Route path="/pharmacy" element={<PharmacyDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
