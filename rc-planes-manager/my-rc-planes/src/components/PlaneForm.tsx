import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const PlaneForm: React.FC = () => {
	const [name, setName] = useState('');
	const [components, setComponents] = useState<{ [key: string]: { value: string; link: string } }>({});
	const [image, setImage] = useState<string | null>(null);
			const navigate = useNavigate();
	const { user } = useAuth();

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const stored = localStorage.getItem('planes');
		const planes = stored ? JSON.parse(stored) : [];
		const newPlane = {
			id: Date.now().toString(),
			name,
			components,
			image,
			user_id: user ? user.id : null, // Add user_id if user is logged in
		};
		localStorage.setItem('planes', JSON.stringify([...planes, newPlane]));
		navigate('/planes');
	};

	return (
		<>
			<button onClick={() => navigate('/')} style={{ position: 'absolute', top: 16, left: 16, background: '#2de2e6', color: '#181c22', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', zIndex: 10 }}>Home</button>
			<form onSubmit={handleSubmit} style={{ maxWidth: 520, margin: '0 auto', padding: '24px', background: '#232a34', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
			<h2>Add New Plane</h2>
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
				<label style={{ minWidth: 100, marginBottom: 0 }}>
					Plane Name:
				</label>
				<input value={name} onChange={e => setName(e.target.value)} required style={{ flex: 1 }} />
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
				<label style={{ minWidth: 100, marginBottom: 0 }}>Plane Image:</label>
				<input type="file" accept="image/*" onChange={handleImageChange} style={{ flex: 1 }} />
			</div>
			{image && (
				<div style={{ marginTop: '10px', marginBottom: '16px' }}>
					<img src={image} alt="Plane preview" style={{ maxWidth: '180px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
				</div>
			)}
			<h3>Components</h3>
			{defaultParts.map(part => (
				<div key={part} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
					<label style={{ minWidth: 100, marginBottom: 0 }}>{part}:</label>
					<input
						placeholder={`Type for ${part}`}
						value={components[part]?.value || ''}
						onChange={e => handleChange(part, 'value', e.target.value)}
						style={{ flex: 1 }}
					/>
					<input
						placeholder={`Link for ${part}`}
						value={components[part]?.link || ''}
						onChange={e => handleChange(part, 'link', e.target.value)}
						style={{ flex: 1 }}
					/>
				</div>
			))}
			<button type="submit">Save Plane</button>
		</form>
		</>
	);
};

export default PlaneForm;
