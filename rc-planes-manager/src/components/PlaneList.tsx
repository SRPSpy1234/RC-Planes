import React from 'react';
import { Plane } from '../types';
import './PlaneList.css'; // Assuming you have some styles for the PlaneList

interface PlaneListProps {
    planes: Plane[];
    onSelectPlane: (plane: Plane) => void;
}

const PlaneList: React.FC<PlaneListProps> = ({ planes, onSelectPlane }) => {
    return (
        <div className="plane-list">
            <h2>RC Planes</h2>
            <ul>
                {planes.map((plane) => (
                    <li key={plane.id} onClick={() => onSelectPlane(plane)}>
                        {plane.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlaneList;