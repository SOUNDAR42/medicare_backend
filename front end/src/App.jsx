
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import WelcomePage from './pages/WelcomePage';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import PharmacyDashboard from './pages/PharmacyDashboard';

import MedicineList from './pages/MedicineList';
import NewMedicine from './pages/NewMedicine';
import ManufacturerList from './pages/ManufacturerList';
import NewManufacturer from './pages/NewManufacturer';
import SpecializationList from './pages/SpecializationList';
import NewSpecialization from './pages/NewSpecialization';

// New Auth Components
import RoleSelection from './pages/auth/RoleSelection';
import ActionSelection from './pages/auth/ActionSelection';
import AuthForm from './pages/auth/AuthForm';

const ConditionalNavbar = () => {
  const location = useLocation();
  // Don't show global navbar on Welcome Page ('/')
  if (location.pathname === '/') {
    return null;
  }
  return <Navbar />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans">
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/book_appointment" element={<BookAppointment />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/pharmacy/:id/dashboard" element={<PharmacyDashboard />} />
          <Route path="/medicine" element={<MedicineList />} />
          <Route path="/medicine/new_medicine" element={<NewMedicine />} />
          <Route path="/manufacture" element={<ManufacturerList />} />
          <Route path="/manufacture/add_manufacture" element={<NewManufacturer />} />
          <Route path="/specializtion" element={<SpecializationList />} />
          <Route path="/specializtion/add_specializtion" element={<NewSpecialization />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<RoleSelection />} />
          <Route path="/auth/:role" element={<ActionSelection />} />
          <Route path="/auth/:role/:mode" element={<AuthForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
