import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const ViewPrebuiltPlane: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plane, setPlane] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        supabase
            .from('planes')
            .select('*')
            .eq('id', id)
            .is('user_id', null)
            .single()
            .then(({ data, error }) => {
                if (error || !data) {
                    setError('Plane not found.');
                    setPlane(null);
                } else {
                    setPlane(data);
                }
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ color: '#2de2e6', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
    if (error || !plane) return <div style={{ color: '#ff6f61', textAlign: 'center', marginTop: 80 }}>{error || 'Plane not found.'}</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <div style={{ position: 'relative', background: '#232a34', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: '32px', maxWidth: 520, width: '100%', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ marginBottom: 0, color: '#2de2e6', textAlign: 'center' }}>{plane.name}</h2>
                    {plane.image && (
                        <div style={{ margin: '18px 0', textAlign: 'center' }}>
                            <img src={plane.image} alt="Plane" style={{ maxWidth: '320px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
                        </div>
                    )}
                    <div style={{ color: '#eaf6fb', marginBottom: 8 }}><b>Type:</b> {plane.type || 'N/A'}</div>
                    <div style={{ color: '#eaf6fb', marginBottom: 8 }}><b>Skill:</b> {plane.skill || 'N/A'}</div>
                    <div style={{ color: '#eaf6fb', marginBottom: 8 }}><b>Price:</b> {plane.price != null ? `$${plane.price}` : 'N/A'}</div>
                    {plane.notes && (
                        <div style={{ color: '#2de2e6', margin: '18px 0', textAlign: 'center', fontStyle: 'italic', background: '#181c22', borderRadius: 8, padding: 12 }}>
                            <b>Notes:</b> {plane.notes}
                        </div>
                    )}
                    <h3 style={{ color: '#2de2e6', marginBottom: '10px', textAlign: 'center' }}>Components</h3>
                    <ul style={{ width: '100%', maxWidth: 420, margin: '0 auto', textAlign: 'left' }}>
                        {defaultParts.map(part => (
                            <li key={part} style={{ marginBottom: '8px' }}>
                                <strong>{part}:</strong> <span>{plane.components?.[part]?.value || ''}</span>
                                {plane.components?.[part]?.link && (
                                    <>
                                        {' '}<a href={plane.components[part].link} target="_blank" rel="noopener noreferrer" style={{ color: '#2de2e6', marginLeft: 8 }}>🔗</a>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ViewPrebuiltPlane;
