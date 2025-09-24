import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export type Plane = {
	id: string;
	name: string;
	components: {
		[key: string]: {
			value: string;
			link?: string;
		};
	};
	image?: string;
};

const PlaneList: React.FC = () => {
	const [planes, setPlanes] = useState<Plane[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem('planes');
		let allPlanes = stored ? JSON.parse(stored) : [];
		setPlanes(allPlanes);
	}, []);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
			<h2 style={{ textAlign: 'center', color: '#2de2e6', marginBottom: '18px' }}>All RC Planes</h2>
			<Link to="/add" className="main-btn" style={{ marginBottom: '18px', minWidth: '180px', fontSize: '1.1rem', textAlign: 'center' }}>Add New Plane</Link>
			<ul style={{ width: '100%', maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
				{planes.map(plane => (
					<li key={plane.id} style={{ background: 'none', boxShadow: 'none', padding: 0, marginBottom: '18px' }}>
						<Link to={`/view/${plane.id}`} className="main-btn" style={{ width: '320px', textAlign: 'left', padding: '10px 18px', fontSize: '1rem', fontWeight: 600, display: 'block', margin: '0 auto', textDecoration: 'none' }}>
							{plane.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PlaneList;
