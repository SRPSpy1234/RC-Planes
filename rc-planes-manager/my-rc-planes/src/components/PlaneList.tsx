
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../App';

type Plane = {
	id: string;
	name: string;
	components: any;
	image?: string;
};

const PlaneList: React.FC = () => {
		const [planes, setPlanes] = useState<Plane[]>([]);
		const { user } = useAuth();
		const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		const fetchPlanes = async () => {
			const { data, error } = await supabase
				.from('planes')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false });
			if (!error && data) setPlanes(data);
		};
		fetchPlanes();
	}, [user]);

	if (!user) {
		return <div style={{ color: '#2de2e6', textAlign: 'center', marginTop: 80 }}>Please log in to view your planes.</div>;
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
			<button onClick={() => navigate('/')} style={{ position: 'absolute', top: 16, left: 16, background: '#2de2e6', color: '#181c22', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', zIndex: 10 }}>Home</button>
			<h2 style={{ textAlign: 'center', color: '#2de2e6', marginBottom: '18px' }}>Your RC Planes</h2>
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
