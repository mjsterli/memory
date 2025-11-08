import { useEffect, useState } from 'react';
import './App.css';
import shapes from './assets/shapes.json';

interface Shape {
  name: string;
}

const ShapeComponent = ({ name }: { name: string }) => {
  const size = 75; // Size of the shape in pixels

  switch (name) {
    case 'Triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <polygon points="25,5 45,45 5,45" stroke="currentColor" fill="none" />
        </svg>
      );
    case 'Square':
      return (
        <svg width={size} height={size} viewBox="0 0 60 60">
          <rect x="5" y="5" width="50" height="50" stroke="currentColor" fill="none" />
        </svg>
      );
    case 'Circle':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

function App() {
  const [gridShapes, setGridShapes] = useState<Shape[]>([]);

  useEffect(() => {
    // Create pairs of shapes to ensure matching is possible
    const shapePairs = [...shapes, ...shapes];
    // Shuffle the shapes
    const shuffled = shapePairs.sort(() => Math.random() - 0.5);
    setGridShapes(shuffled);
  }, []);

  return (
    <div className="grid-container">
      {gridShapes.map((shape, index) => (
        <div key={index} className="grid-item">
          <ShapeComponent name={shape.name} />
        </div>
      ))}
    </div>
  );
}

export default App;
