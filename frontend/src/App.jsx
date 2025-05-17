import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import SubmissionForm from './components/SubmissionForm';
import StatusTracking from './components/StatusTracking';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserRegistration from './components/UserRegistration';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import WhyCES from './components/WhyCES';
import SuccessStoriesSlider from './components/SuccessStoriesSlider';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/submit" element={<SubmissionForm />} />
          <Route path="/status" element={<StatusTracking />} />
          <Route path="/why-ces" element={<WhyCES />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/success-story" element={<SuccessStoriesSlider />} />
        </Routes>
      </Container>

      <Footer/>
    </Router>
  );
}

export default App;
