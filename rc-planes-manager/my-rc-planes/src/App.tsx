import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PlaneList from './components/PlaneList';
import PlaneForm from './components/PlaneForm';
import EditPlane from './pages/EditPlane';
import ViewPlane from './pages/ViewPlane';
import OrderFormPage from './pages/OrderFormPage';
import PlaneOrdersMenu from './components/PlaneOrdersMenu';
import './App.css';

const Home: React.FC = () => {
  const [showOrderLink, setShowOrderLink] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const orderFormUrl = `${window.location.origin}/order`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '24px', color: '#2de2e6', textAlign: 'center' }}>RC Planes Manager</h1>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', justifyContent: 'center' }}>
        <Link to="/planes" className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }}>View All Planes</Link>
        <Link to="/add" className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem' }}>Add New Plane</Link>
      </div>
      <button className="main-btn" style={{ minWidth: '180px', fontSize: '1.1rem', marginBottom: '18px', marginRight: '12px' }} onClick={() => setShowOrderLink(true)}>
        Get Link to Order Form
      </button>
      <button className="main-btn" style={{ minWidth: '120px', fontSize: '1.1rem', marginBottom: '18px' }} onClick={() => setShowMenu(true)}>
        Menu
      </button>
      {showOrderLink && (
        <div style={{ marginBottom: '18px', color: '#2de2e6', fontWeight: 600 }}>
          Share this link: <a href={orderFormUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0fa3b1', textDecoration: 'underline' }}>{orderFormUrl}</a>
        </div>
      )}
      {showMenu && (
        <PlaneOrdersMenu onClose={() => setShowMenu(false)} />
      )}
      <p style={{ color: '#eaf6fb', fontSize: '1.1rem', textAlign: 'center', maxWidth: 400 }}>Welcome! Manage your RC planes and their components here.</p>
    </div>
  );
};

const App: React.FC = () => (
  <div className="app-container">
    <div style={{ width: '100%', background: '#2de2e6', padding: '18px 0', textAlign: 'center', color: '#181c22', fontWeight: 700, fontSize: '2rem', letterSpacing: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
      FlightHQ
    </div>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planes" element={<PlaneList />} />
        <Route path="/add" element={<PlaneForm />} />
        <Route path="/edit/:id" element={<EditPlane />} />
        <Route path="/view/:id" element={<ViewPlane />} />
        <Route path="/order" element={<OrderFormPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </div>
);

export default App;
