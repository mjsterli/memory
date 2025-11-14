import { useEffect, useRef, useState } from 'react';
import './App.css';
import shapes from './assets/shapes.json';

interface Shape {
  name: string;
}

function App() {
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [gridShapes, setGridShapes] = useState<Shape[]>([]);
  // track which cards are face-up
  const [flipped, setFlipped] = useState<boolean[]>([]);
  // track which cards are disabled (prevent click)
  const [disabledArr, setDisabledArr] = useState<boolean[]>([]);
  // store first selection by index instead of DOM element
  const [first, setFirst] = useState<{ index: number; shape: string } | undefined>();

  function flipCard(index: number, shape: string) {
    // ignore clicks on already flipped card
    if (flipped[index]) return;

    // flip this card face-up and disable it immediately to avoid double-click
    setFlipped(prev => {
      const nxt = [...prev];
      nxt[index] = true;
      return nxt;
    });
    setDisabledArr(prev => {
      const nxt = [...prev];
      nxt[index] = true;
      return nxt;
    });

    if (!first) {
      setFirst({ index, shape });
    } else {
      // second selection
      if (first.shape !== shape) {
        // mismatch: flip both back after a delay and re-enable
        setTimeout(() => {
          setFlipped(prev => {
            const nxt = [...prev];
            nxt[first.index] = false;
            nxt[index] = false;
            return nxt;
          });
          setDisabledArr(prev => {
            const nxt = [...prev];
            nxt[first.index] = false;
            nxt[index] = false;
            return nxt;
          });
          setFirst(undefined);
        }, 1000);
      } else {
        // match: keep both flipped and disabled
        setFlipped(prev => {
          const nxt = [...prev];
          nxt[index] = true;
          return nxt;
        });

        setDisabledArr(prev => {
          const nxt = [...prev];
          nxt[first.index] = true;
          nxt[index] = true;
          return nxt;
        });
        setFirst(undefined);
      }
    }

    speak(shape);
    if (flipped.reduce((accum: boolean, currValue: boolean) => accum && currValue)) {
      speak('Good Job Antoine!');
      setTimeout(() => {
        setFlipped([]);
        setDisabledArr([]);
        setFirst(undefined);
      }, 2000);
    }
  }
  function speak(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  const ShapeComponent = ({
    name,
    cards,
    index,
    flipped,
    disabled,
    onClick,
  }: {
    name: string;
    cards: React.MutableRefObject<(HTMLElement | null)[]>;
    index: number;
    flipped: boolean;
    disabled: boolean;
    onClick: () => void;
  }) => {
    const size = 100;
    const strokeWidth = 3; // Size of the shape in pixels

    const setRef = (elem: HTMLElement | null) => {
      cards.current[index] = elem;
    };

    switch (name) {
      case 'Triangle':
        return (
          <button type="button" className={`grid-item-initial ${flipped ? 'grid-item-turnover' : ''}`} ref={setRef} onClick={onClick} disabled={disabled}>
            <svg width={size} height={size} viewBox="0 0 50 50">
              <polygon points="25,5 45,45 5,45" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
            </svg>
          </button>
        );
      case 'Square':
        return (
          <button type="button" className={`grid-item-initial ${flipped ? 'grid-item-turnover' : ''}`} ref={setRef} onClick={onClick} disabled={disabled}>
            <svg width={size} height={size} viewBox="0 0 60 60">
              <rect x="5" y="5" width="50" height="50" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
            </svg>
          </button>
        );
      case 'Circle':
        return (
          <button type="button" className={`grid-item-initial ${flipped ? 'grid-item-turnover' : ''}`} ref={setRef} onClick={onClick} disabled={disabled}>
            <svg width={size} height={size} viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
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
    // initialize flipped/disabled arrays
    setFlipped(new Array(shuffled.length).fill(false));
    setDisabledArr(new Array(shuffled.length).fill(false));
  }, []);

  return (
    <div className="grid-container">
      {gridShapes.map((shape, index) => (
        <div key={index} className="grid-item">
          <ShapeComponent name={shape.name} cards={cards} index={index} flipped={flipped[index]} disabled={disabledArr[index]} onClick={() => flipCard(index, shape.name)} />
        </div>
      ))}
    </div>
  );
}

export default App;
