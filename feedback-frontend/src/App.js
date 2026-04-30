import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm'; 
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
        <Header />
      <Routes>
        <Route path="/" element={<FeedbackForm />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
