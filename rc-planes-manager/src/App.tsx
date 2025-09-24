import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import AddPlane from './pages/AddPlane';
import EditPlane from './pages/EditPlane';
import PlaneList from './components/PlaneList';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <h1>RC Planes Manager</h1>
        <PlaneList />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/add-plane" component={AddPlane} />
          <Route path="/edit-plane/:id" component={EditPlane} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;