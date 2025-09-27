import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const accent = '#2de2e6';

const PlaneOrdersMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) {
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Confirm state for delete/complete
  const [confirmAction, setConfirmAction] = useState<null | { type: 'delete' | 'complete', idx: number }>(null);

  // Delete order
  const handleDelete = async (idx: number) => {
    const order = orders[idx];
    if (!order.id) return;
    await supabase.from('orders').delete().eq('id', order.id);
    setOrders(orders => orders.filter((_, i) => i !== idx));
    setSelected(null);
    setConfirmAction(null);
  };

  // Mark order as complete
  const handleComplete = async (idx: number) => {
    const order = orders[idx];
    if (!order.id) return;
    await supabase.from('orders').update({ completed: true }).eq('id', order.id);
    setOrders(orders => {
      const updated = orders.map((o, i) => i === idx ? { ...o, completed: true } : o);
      // If currently selected, update the selected order reference too
      return updated;
    });
    setConfirmAction(null);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,28,34,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#232a34', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: 32, minWidth: 340, maxWidth: 520, width: '100%', color: '#eaf6fb', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: accent, color: '#181c22', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer', fontWeight: 700 }}>×</button>
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 16, left: 16, background: '#2de2e6', color: '#181c22', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', zIndex: 10 }}>Home</button>
        <h2 style={{ color: accent, textAlign: 'center', marginBottom: 18 }}>Ordered Planes</h2>
        {loading && <div style={{ textAlign: 'center', color: accent }}>Loading orders...</div>}
        {!loading && !orders.length && <div style={{ textAlign: 'center', color: accent }}>No orders found.</div>}
        {selected === null && !loading ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {orders.map((order: any, idx: number) => (
              <li key={order.id || idx} style={{ marginBottom: 12 }}>
                <button className="main-btn" style={{ width: '100%', textAlign: 'left', padding: '10px 18px', fontSize: '1rem', fontWeight: 600 }} onClick={() => setSelected(idx)}>
                  {orders[idx].name} - {orders[idx].planeType} ({orders[idx].experience})
                  {orders[idx].completed && <span style={{ color: '#7dff7d', marginLeft: 8 }}>(Completed)</span>}
                </button>
              </li>
            ))}
          </ul>
        ) : selected !== null && !loading ? (
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
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button className="main-btn" style={{ background: '#ff6f61', color: '#fff', flex: 1 }} onClick={() => setConfirmAction({ type: 'delete', idx: selected })}>Delete</button>
              {!orders[selected].completed && (
                <button className="main-btn" style={{ background: '#7dff7d', color: '#181c22', flex: 1 }} onClick={() => setConfirmAction({ type: 'complete', idx: selected })}>Mark Complete</button>
              )}
            </div>
            {confirmAction && confirmAction.idx === selected && (
              <div style={{ marginTop: 18, background: '#181c22', borderRadius: 8, padding: 16, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                <div style={{ marginBottom: 12 }}>
                  {confirmAction.type === 'delete' ? 'Are you sure you want to delete this order?' : 'Mark this order as complete?'}
                </div>
                <button className="main-btn" style={{ marginRight: 12 }} onClick={() => {
                  if (confirmAction.type === 'delete') handleDelete(selected);
                  else if (confirmAction.type === 'complete') handleComplete(selected);
                }}>Confirm</button>
                <button className="main-btn" onClick={() => setConfirmAction(null)}>Cancel</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PlaneOrdersMenu;
