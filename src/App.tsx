import { useEffect, useRef, useState } from 'react';
import './App.css';
import shapes from './assets/shapes.json';

interface Shape {
  name: string;
}

function App() {
  const matches = [];
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [gridShapes, setGridShapes] = useState<Shape[]>([]);

  function flipCard(index: number, shape: string) {
    const card = cards.current[index];

    if (!card) return;
    card.classList.toggle('grid-item-turnover');

    if (matches.length == 0) {
      matches.push({ card: card, shape: shape });
    } else {
      if (matches[0].shape == shape);
    }
  }

  const ShapeComponent = ({ name, cards, index }: { name: string; cards: React.MutableRefObject<(HTMLElement | null)[]>; index: number }) => {
    const size = 75; // Size of the shape in pixels

    const setRef = (elem: HTMLElement | null) => {
      cards.current[index] = elem;
    };

    switch (name) {
      case 'Triangle':
        return (
          <button type="button" className="grid-item-initial" ref={setRef} onClick={() => flipCard(index, name)}>
            <svg width={size} height={size} viewBox="0 0 50 50">
              <polygon points="25,5 45,45 5,45" stroke="currentColor" fill="none" />
            </svg>
          </button>
        );
      case 'Square':
        return (
          <button type="button" className="grid-item-initial" ref={setRef} onClick={() => flipCard(index, name)}>
            <svg width={size} height={size} viewBox="0 0 60 60">
              <rect x="5" y="5" width="50" height="50" stroke="currentColor" fill="none" />
            </svg>
          </button>
        );
      case 'Circle':
        return (
          <button type="button" className="grid-item-initial" ref={setRef} onClick={() => flipCard(index, name)}>
            <svg width={size} height={size} viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" stroke="currentColor" fill="none" />
            </svg>
          </button>
        );
      default:
        return null;
    }
  };

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
          <ShapeComponent name={shape.name} cards={cards} index={index} />
        </div>
      ))}
    </div>
  );
}

export default App;
