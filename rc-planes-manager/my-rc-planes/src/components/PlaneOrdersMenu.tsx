import React, { useState } from 'react';

const accent = '#2de2e6';

// Dummy orders for demonstration. Replace with real data source if available.
const getOrders = () => {
  const stored = localStorage.getItem('planeOrders');
  return stored ? JSON.parse(stored) : [];
};

const PlaneOrdersMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const orders = getOrders();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,28,34,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#232a34', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: 32, minWidth: 340, maxWidth: 520, width: '100%', color: '#eaf6fb', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: accent, color: '#181c22', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer', fontWeight: 700 }}>×</button>
        <h2 style={{ color: accent, textAlign: 'center', marginBottom: 18 }}>Ordered Planes</h2>
        {!orders.length && <div style={{ textAlign: 'center', color: accent }}>No orders found.</div>}
        {selected === null ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {orders.map((order: any, idx: number) => (
              <li key={idx} style={{ marginBottom: 12 }}>
                <button className="main-btn" style={{ width: '100%', textAlign: 'left', padding: '10px 18px', fontSize: '1rem', fontWeight: 600 }} onClick={() => setSelected(idx)}>
                  {order.name} - {order.planeType} ({order.experience})
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <button className="main-btn" style={{ marginBottom: 12 }} onClick={() => setSelected(null)}>&lt; Back to List</button>
            <div style={{ marginBottom: 10 }}><strong>Name:</strong> {orders[selected].name}</div>
            <div style={{ marginBottom: 10 }}><strong>Email:</strong> {orders[selected].email}</div>
            <div style={{ marginBottom: 10 }}><strong>Skill Level:</strong> {orders[selected].experience}</div>
            <div style={{ marginBottom: 10 }}><strong>Type:</strong> {orders[selected].planeType}</div>
            <div style={{ marginBottom: 10 }}><strong>Speed:</strong> {orders[selected].speed}</div>
            <div style={{ marginBottom: 10 }}><strong>Power:</strong> {orders[selected].power}</div>
            <div style={{ marginBottom: 10 }}><strong>Custom Specs:</strong> {orders[selected].customSpecs}</div>
            <div style={{ marginBottom: 10 }}><strong>Notes:</strong> {orders[selected].notes}</div>
            <div style={{ marginBottom: 10 }}><strong>Parts:</strong><br /><pre style={{ background: '#181c22', padding: 10, borderRadius: 6, color: accent }}>{orders[selected].parts}</pre></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaneOrdersMenu;
