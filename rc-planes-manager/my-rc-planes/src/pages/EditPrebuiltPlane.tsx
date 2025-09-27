import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../App';

const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const EditPrebuiltPlane: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [skill, setSkill] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [components, setComponents] = useState<{ [key: string]: { value: string; link: string } }>({});
    const [price, setPrice] = useState<number | ''>('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || !user) return;
        setLoading(true);
        supabase
            .from('planes')
            .select('*')
            .eq('id', id)
            .is('user_id', null)
            .single()
            .then(({ data, error }) => {
                if (error || !data) {
                    setError('Plane not found or you do not have permission.');
                    setLoading(false);
                } else {
                    setName(data.name);
                    setType(data.type || '');
                    setSkill(data.skill || '');
                    setImage(data.image || null);
                    setComponents(data.components || {});
                    setPrice(data.price ?? '');
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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
            .update({ name, type, skill, image, components, price: price === '' ? null : Number(price) })
            .eq('id', id)
            .is('user_id', null);
        if (error) setError(error.message);
        else navigate('/inspiration-prebuilt');
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
            .is('user_id', null);
        if (error) setError(error.message);
        else navigate('/inspiration-prebuilt');
    };

    if (loading) return <div style={{ color: '#2de2e6', textAlign: 'center', marginTop: 80 }}>Loading...</div>;
    if (error) return <div style={{ color: '#ff6f61', textAlign: 'center', marginTop: 80 }}>{error}</div>;

    return (
        <div>
            {/* Home button removed, now in top banner dropdown */}
            <form
                onSubmit={handleSubmit}
                style={{ maxWidth: 520, margin: '0 auto', padding: '24px', background: '#232a34', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >
                <h2 style={{ marginBottom: '14px', color: '#2de2e6' }}>Edit Inspiration Plane</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <label style={{ minWidth: 90, marginBottom: 0 }}>Plane Name:</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        style={{ flex: 1, padding: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <label style={{ minWidth: 90, marginBottom: 0 }}>Type:</label>
                    <input
                        value={type}
                        onChange={e => setType(e.target.value)}
                        style={{ flex: 1, padding: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <label style={{ minWidth: 90, marginBottom: 0 }}>Skill:</label>
                    <input
                        value={skill}
                        onChange={e => setSkill(e.target.value)}
                        style={{ flex: 1, padding: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <label style={{ minWidth: 90, marginBottom: 0 }}>Price ($):</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        style={{ flex: 1, padding: '8px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <label style={{ minWidth: 90, marginBottom: 0 }}>Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ flex: 1 }} />
                </div>
                {image && (
                    <div style={{ marginTop: '10px', marginBottom: '16px' }}>
                        <img src={image} alt="Plane preview" style={{ maxWidth: '180px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
                    </div>
                )}
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
export default EditPrebuiltPlane;
