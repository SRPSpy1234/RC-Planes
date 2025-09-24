import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Plane } from '../types';
import { getPlaneById, updatePlane } from '../services/planesService';
import PlaneForm from '../components/PlaneForm';
import ComponentEditor from '../components/ComponentEditor';

const EditPlane: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [plane, setPlane] = useState<Plane | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlane = async () => {
            const fetchedPlane = await getPlaneById(id);
            setPlane(fetchedPlane);
            setLoading(false);
        };

        fetchPlane();
    }, [id]);

    const handleUpdate = async (updatedPlane: Plane) => {
        await updatePlane(updatedPlane);
        history.push('/');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!plane) {
        return <div>Plane not found</div>;
    }

    return (
        <div>
            <h1>Edit Plane</h1>
            <PlaneForm plane={plane} onSubmit={handleUpdate} />
            <ComponentEditor components={plane.components} />
        </div>
    );
};

export default EditPlane;