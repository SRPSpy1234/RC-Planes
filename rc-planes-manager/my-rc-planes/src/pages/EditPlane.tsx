import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../App';

const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const EditPlane: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [components, setComponents] = useState<{ [key: string]: { value: string; link: string } }>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !user) return;
        setLoading(true);
        supabase
            .from('planes')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()
            .then(({ data, error }) => {
                if (error || !data) {
                    setError('Plane not found or you do not have permission.');
                    setLoading(false);
                } else {
                    setName(data.name);
                    setComponents(data.components || {});
                    setLoading(false);
                }
            });
    }, [id, user]);

    const handleChange = (part: string, field: 'value' | 'link', value: string) => {
        setComponents(prev => ({
            ...prev,
            [part]: {
                ...prev[part],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!user) {
            setError('You must be logged in.');
            return;
        }
        const { error } = await supabase
            .from('planes')
            .update({ name, components })
            .eq('id', id)
            .eq('user_id', user.id);
        if (error) setError(error.message);
        else navigate('/planes');
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this plane?')) return;
        setError('');
        if (!user) {
            setError('You must be logged in.');
            return;
        }
        const { error } = await supabase
            .from('planes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        if (error) setError(error.message);
        else navigate('/planes');
    };

    if (loading) return <div style={{ color: '#2de2e6', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
    if (error) return <div style={{ color: '#ff6f61', textAlign: 'center', marginTop: 80 }}>{error}</div>;

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                style={{ position: 'absolute', top: 16, left: 16, background: '#2de2e6', color: '#181c22', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', zIndex: 10 }}
            >
                Home
            </button>
            <form
                onSubmit={handleSubmit}
                style={{ maxWidth: 520, margin: '0 auto', padding: '24px', background: '#232a34', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >
                <h2 style={{ marginBottom: '14px', color: '#2de2e6' }}>Edit Plane</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <label style={{ minWidth: 90, marginBottom: 0 }}>Plane Name:</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        style={{ flex: 1, padding: '8px' }}
                    />
                </div>
                <h3 style={{ marginBottom: '8px', color: '#2de2e6' }}>Components</h3>
                {defaultParts.map(part => (
                    <div key={part} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <label style={{ minWidth: 90, marginBottom: 0 }}>{part}:</label>
                        <input
                            placeholder={`Type for ${part}`}
                            value={components[part]?.value || ''}
                            onChange={e => handleChange(part, 'value', e.target.value)}
                            style={{ flex: 1, padding: '6px' }}
                        />
                        <input
                            placeholder={`Link for ${part}`}
                            value={components[part]?.link || ''}
                            onChange={e => handleChange(part, 'link', e.target.value)}
                            style={{ flex: 1, padding: '6px' }}
                        />
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button type="submit" style={{ flex: 1, minWidth: 0 }}>Save</button>
                    <button type="button" style={{ flex: 1, minWidth: 0, background: '#ff6f61', color: '#fff' }} onClick={handleDelete}>Delete</button>
                </div>
            </form>
        </div>
    );
};
export default EditPlane;
// ...existing code...
