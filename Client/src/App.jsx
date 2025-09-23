import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import AddPropertyForm from './components/AddPropertyForm';
import './App.css';

function App() {
  const propertyListRef = useRef();

  const handlePropertyAdded = () => {
    if (propertyListRef.current) {
      propertyListRef.current.refreshProperties();
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/properties" element={<PropertyList ref={propertyListRef} />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/add-property" element={
              <ProtectedRoute>
                <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
