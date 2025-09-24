import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>Welcome to the RC Planes Manager</h1>
            <p>Manage your RC planes and their components easily.</p>
            <div className="links">
                <Link to="/add-plane">Add a New Plane</Link>
                <Link to="/edit-plane">Edit an Existing Plane</Link>
                <Link to="/planes">View Plane List</Link>
            </div>
        </div>
    );
};

export default Home;