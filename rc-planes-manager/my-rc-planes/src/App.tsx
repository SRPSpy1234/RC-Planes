
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PlaneList from './components/PlaneList';
import PlaneForm from './components/PlaneForm';
import EditPlane from './pages/EditPlane';
import ViewPlane from './pages/ViewPlane';
import './App.css';

const Home: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
    <h1 style={{ marginBottom: '24px', color: '#2de2e6', textAlign: 'center' }}>RC Planes Manager</h1>
    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', justifyContent: 'center' }}>
      <Link to="/planes" className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }}>View All Planes</Link>
      <Link to="/add" className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }}>Add New Plane</Link>
    </div>
    <p style={{ color: '#eaf6fb', fontSize: '1.1rem', textAlign: 'center', maxWidth: 400 }}>Welcome! Manage your RC planes and their components here.</p>
  </div>
);

const App: React.FC = () => (
  <div className="app-container">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planes" element={<PlaneList />} />
        <Route path="/add" element={<PlaneForm />} />
        <Route path="/edit/:id" element={<EditPlane />} />
        <Route path="/view/:id" element={<ViewPlane />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </div>
);

export default App;
