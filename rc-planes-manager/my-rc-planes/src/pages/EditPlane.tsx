
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const EditPlane: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [components, setComponents] = useState<{ [key: string]: { value: string; link: string } }>({});

    useEffect(() => {
        const stored = localStorage.getItem('planes');
        const planes = stored ? JSON.parse(stored) : [];
        const plane = planes.find((p: any) => p.id === id);
        if (plane) {
            setName(plane.name);
            setComponents(plane.components);
        }
    }, [id]);

    const handleChange = (part: string, field: 'value' | 'link', value: string) => {
        setComponents((prev: { [key: string]: { value: string; link: string } }) => ({
            ...prev,
            [part]: {
                ...prev[part],
                [field]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const stored = localStorage.getItem('planes');
        let planes = stored ? JSON.parse(stored) : [];
        planes = planes.map((p: any) =>
            p.id === id ? { ...p, name, components } : p
        );
        localStorage.setItem('planes', JSON.stringify(planes));
        navigate('/planes');
    };

    const handleDelete = () => {
        const stored = localStorage.getItem('planes');
        let planes = stored ? JSON.parse(stored) : [];
        planes = planes.filter((p: any) => p.id !== id);
        localStorage.setItem('planes', JSON.stringify(planes));
        navigate('/planes');
    };

    // No owner check
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 520, margin: '0 auto', padding: '24px', background: '#232a34', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
            <h2 style={{ marginBottom: '14px', color: '#2de2e6' }}>Edit Plane</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <label style={{ minWidth: 90, marginBottom: 0 }}>
                    Plane Name:
                </label>
                <input value={name} onChange={e => setName(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
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
    );
};

export default EditPlane;
