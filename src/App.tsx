import { useEffect, useRef, useState } from 'react';
import './App.css';
import shapes from './assets/shapes.json';
import encouragingPhrases from './assets/encouraging-phrases.json';
import excitedPhrases from './assets/excited-phrases.json';
import endingPhrases from './assets/ending-phrases.json';

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

  const [encourageIndex, setEncourageIndex] = useState(0);
  const [excitedIndex, setExcitedIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(0);

  function flipCard(index: number, shape: string) {
    // ignore clicks on already flipped card
    if (flipped[index]) return;

    speak(shape);
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
        speak(encouragingPhrases[encourageIndex]);
        setEncourageIndex(Math.floor((encourageIndex + 1) % encouragingPhrases.length));
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
        speak(excitedPhrases[excitedIndex]);
        setExcitedIndex(Math.floor((excitedIndex + 1) % excitedPhrases.length));
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

      case 'Diamond':
        return (
          <button type="button" className={`grid-item-initial ${flipped ? 'grid-item-turnover' : ''}`} ref={setRef} onClick={onClick} disabled={disabled}>
            <svg width={size} height={150} viewBox="0 0 100 150">
              <polygon points="50,10 90,75 50,140 10,75" fill="none" stroke="currentColor" stroke-width={6} />
            </svg>
          </button>
        );

      case 'Rectangle':
        return (
          <button type="button" className={`grid-item-initial ${flipped ? 'grid-item-turnover' : ''}`} ref={setRef} onClick={onClick} disabled={disabled}>
            <svg width="110" height="60" viewBox="0 0 110 60">
              <rect x="10" y="10" width="90" height="40" fill="none" stroke="currentColor" stroke-width={5} />
            </svg>
          </button>
        );
      default:
        return null;
    }
  };

  function pickShapes(): { name: string }[] {
    const selectShapes: { name: string }[] = [];

    while (selectShapes.length < 3) {
      const rShapeIndex = Math.floor(Math.random() * 10) % shapes.length;
      if (!selectShapes.find(shape => shape.name == shapes[rShapeIndex].name)) selectShapes.push(shapes[rShapeIndex]);
    }

    return selectShapes;
  }

  useEffect(() => {
    // Create pairs of shapes to ensure matching is possible
    const pickedShapes = pickShapes();
    const shapePairs = [...pickedShapes, ...pickedShapes];
    // Shuffle the shapes
    const shuffled = shapePairs.sort(() => Math.random() - 0.5);
    setGridShapes(shuffled);
    // initialize flipped/disabled arrays
    setFlipped(new Array(shuffled.length).fill(false));
    setDisabledArr(new Array(shuffled.length).fill(false));
  }, []);

  useEffect(() => {
    if (flipped.length != 0 && flipped.reduce((accum: boolean, currValue: boolean) => accum && currValue)) {
      speak(endingPhrases[endingIndex]);
      setEndingIndex(Math.floor((endingIndex + 1) % endingPhrases.length));

      setTimeout(() => {
        setFlipped(new Array(6).fill(false));
        setDisabledArr(new Array(6).fill(false));
        setFirst(undefined);
        const pickedShapes = pickShapes();
        const shapePairs = [...pickedShapes, ...pickedShapes];
        // Shuffle the shapes
        const shuffled = shapePairs.sort(() => Math.random() - 0.5);
        setGridShapes(shuffled);
      }, 2000);
    }
  }, [flipped]);

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
