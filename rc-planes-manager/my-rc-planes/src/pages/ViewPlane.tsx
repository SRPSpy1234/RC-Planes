import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const ViewPlane: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [plane, setPlane] = useState<any>(null);

	useEffect(() => {
		const stored = localStorage.getItem('planes');
		const planes = stored ? JSON.parse(stored) : [];
		const found = planes.find((p: any) => p.id === id);
		setPlane(found);
	}, [id]);

	if (!plane) return <div>Plane not found.</div>;

	const openAllLinks = () => {
		defaultParts.forEach(part => {
			const link = plane.components[part]?.link;
			if (link && typeof link === 'string' && link.trim() && link.startsWith('http')) {
				window.open(link, '_blank');
			}
		});
	};

	// Color map for each component
	const partColors: { [key: string]: string } = {
		Motor: '#2de2e6',
		ESC: '#f7b32b',
		Battery: '#ff6f61',
		Servos: '#0fa3b1',
		Propeller: '#f72b50',
		Receiver: '#7d5fff',
		Other: '#eaf6fb',
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
			<div style={{ position: 'relative', background: '#232a34', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', padding: '32px', maxWidth: 520, width: '100%', margin: '0 auto' }}>
				<button
					style={{ position: 'absolute', top: 18, right: 18, background: '#2de2e6', color: '#181c22', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
					title="Edit Plane"
					onClick={() => navigate(`/edit/${plane.id}`)}
				>
					✏️
				</button>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<h2 style={{ marginBottom: 0, color: '#2de2e6', textAlign: 'center' }}>{plane.name}</h2>
					{plane.image && (
						<div style={{ margin: '18px 0', textAlign: 'center' }}>
							<img src={plane.image} alt="Plane" style={{ maxWidth: '320px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
						</div>
					)}
					<button
						type="button"
						style={{ margin: '18px 0', background: 'linear-gradient(90deg, #2de2e6 0%, #0fa3b1 100%)', color: '#181c22', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
						onClick={openAllLinks}
					>
						Open All Links
					</button>
					<h3 style={{ color: '#2de2e6', marginBottom: '10px', textAlign: 'center' }}>Components</h3>
					<ul style={{ width: '100%', maxWidth: 420, margin: '0 auto', textAlign: 'left' }}>
						{defaultParts.map(part => (
							<li key={part} className={`part-${part}`} style={{ marginBottom: '8px' }}>
								<strong style={{ color: partColors[part] }}>{part}:</strong> <span style={{ color: partColors[part] }}>{plane.components[part]?.value || ''}</span>
								{plane.components[part]?.link && (
									<>
										{' '}<a href={plane.components[part].link} target="_blank" rel="noopener noreferrer" style={{ color: partColors[part], marginLeft: 8 }}>🔗</a>
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

export default ViewPlane;
