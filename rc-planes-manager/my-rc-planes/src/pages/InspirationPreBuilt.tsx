import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../App';

type Plane = {
  id: string;
  name: string;
  type?: string;
  skill?: string;
  image?: string;
  price?: number;
};

const accent = '#2de2e6';


const InspirationPreBuilt: React.FC = () => {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && (user.user_metadata?.username === 'SRPSpy1234' || user.email?.split('@')[0] === 'SRPSpy1234');

  useEffect(() => {
    const fetchPlanes = async () => {
      setLoading(true);
      // Fetch public inspiration planes (user_id is null)
      const { data, error } = await supabase
        .from('planes')
        .select('id, name, type, skill, image, price')
        .is('user_id', null)
        .order('created_at', { ascending: false });
      if (!error && data) setPlanes(data);
      setLoading(false);
    };
    fetchPlanes();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '48px auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: accent, color: '#181c22', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
        >
          Home
        </button>
        <h2 style={{ color: accent, textAlign: 'center', margin: 0, flex: 1 }}>Inspiration / Pre-Built Planes</h2>
        <div style={{ width: 120 }} />
      </div>
      {isAdmin && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button
            className="main-btn"
            style={{ background: accent, color: '#181c22', fontWeight: 700, borderRadius: 8, padding: '8px 24px', fontSize: 16 }}
            onClick={() => navigate('/add-prebuilt')}
          >
            + Add Inspiration Plane
          </button>
        </div>
      )}
      {loading ? (
        <div style={{ color: accent, textAlign: 'center', marginTop: 80 }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {planes.length === 0 && <div style={{ color: accent }}>No inspiration planes found.</div>}
          {planes.map(plane => (
            <div key={plane.id} style={{ background: '#232a34', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', width: 280, padding: 18, color: '#eaf6fb', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {isAdmin && (
                <button
                  style={{ position: 'absolute', top: 10, right: 10, background: accent, color: '#181c22', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 700, cursor: 'pointer', zIndex: 2 }}
                  onClick={() => navigate(`/edit-prebuilt/${plane.id}`)}
                >
                  Edit
                </button>
              )}
              {plane.image ? (
                <img src={plane.image} alt={plane.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 14, background: '#181c22' }} />
              ) : (
                <div style={{ width: '100%', height: 160, background: '#181c22', borderRadius: 10, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 22 }}>
                  No Image
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{plane.name}</div>
              <div style={{ color: accent, fontSize: 16, marginBottom: 4 }}>Type: <span style={{ color: '#eaf6fb' }}>{plane.type || 'N/A'}</span></div>
              <div style={{ color: accent, fontSize: 16, marginBottom: 4 }}>Price: <span style={{ color: '#eaf6fb' }}>{plane.price != null ? `$${plane.price}` : 'N/A'}</span></div>
              <div style={{ color: accent, fontSize: 16 }}>Recommended Skill: <span style={{ color: '#eaf6fb' }}>{plane.skill || 'N/A'}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspirationPreBuilt;
