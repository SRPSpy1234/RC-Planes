import React, { useState } from 'react';

const PlaneForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [motor, setMotor] = useState('');
    const [esc, setEsc] = useState('');
    const [battery, setBattery] = useState('');
    const [servos, setServos] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const planeData = {
            name,
            components: {
                motor,
                esc,
                battery,
                servos,
            },
        };
        onSubmit(planeData);
        setName('');
        setMotor('');
        setEsc('');
        setBattery('');
        setServos('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Plane Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Motor:</label>
                <input
                    type="text"
                    value={motor}
                    onChange={(e) => setMotor(e.target.value)}
                />
            </div>
            <div>
                <label>ESC:</label>
                <input
                    type="text"
                    value={esc}
                    onChange={(e) => setEsc(e.target.value)}
                />
            </div>
            <div>
                <label>Battery:</label>
                <input
                    type="text"
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                />
            </div>
            <div>
                <label>Servos:</label>
                <input
                    type="text"
                    value={servos}
                    onChange={(e) => setServos(e.target.value)}
                />
            </div>
            <button type="submit">Add Plane</button>
        </form>
    );
};

export default PlaneForm;