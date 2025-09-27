import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../App';

const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const AddPrebuiltPlane: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [skill, setSkill] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [components, setComponents] = useState<{ [key: string]: { value: string; link: string } }>({});
    const [price, setPrice] = useState<number | ''>('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        if (!user) {
            setError('You must be logged in.');
            setLoading(false);
            return;
        }
        const { error } = await supabase
            .from('planes')
            .insert([{ name, type, skill, image, components, price: price === '' ? null : Number(price), user_id: null }]);
        setLoading(false);
        if (error) setError(error.message);
        else navigate('/inspiration-prebuilt');
    };

    return (
        <div>
            {/* Home button removed, now in top banner dropdown */}
            <form
                onSubmit={handleSubmit}
                style={{ maxWidth: 520, margin: '0 auto', padding: '24px', background: '#232a34', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >
                <h2 style={{ marginBottom: '14px', color: '#2de2e6' }}>Add Inspiration Plane</h2>
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
                    <button type="submit" style={{ flex: 1, minWidth: 0 }} disabled={loading}>Save</button>
                </div>
                {error && <div style={{ color: '#ff6f61', marginTop: 10 }}>{error}</div>}
            </form>
        </div>
    );
};
export default AddPrebuiltPlane;
