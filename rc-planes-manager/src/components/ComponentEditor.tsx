import React, { useState, useEffect } from 'react';
import { ComponentType } from '../types';

interface ComponentEditorProps {
  selectedPlaneId: string;
  onUpdate: (updatedComponents: ComponentType[]) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({ selectedPlaneId, onUpdate }) => {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the components for the selected plane
    const fetchComponents = async () => {
      setLoading(true);
      // Simulate fetching data from a service
      const fetchedComponents: ComponentType[] = await fetch(`/api/planes/${selectedPlaneId}/components`).then(res => res.json());
      setComponents(fetchedComponents);
      setLoading(false);
    };

    fetchComponents();
  }, [selectedPlaneId]);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedComponents = [...components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    setComponents(updatedComponents);
  };

  const handleSave = () => {
    onUpdate(components);
    // Simulate saving data to a service
    fetch(`/api/planes/${selectedPlaneId}/components`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(components),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Components</h2>
      {components.map((component, index) => (
        <div key={index}>
          <label>
            {component.name}:
            <input
              type="text"
              value={component.details}
              onChange={(e) => handleChange(index, 'details', e.target.value)}
            />
          </label>
        </div>
      ))}
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default ComponentEditor;