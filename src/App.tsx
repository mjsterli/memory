import { useEffect, useRef, useState } from 'react';
import './App.css';
import Card from './Card/Card';
import shapes from './assets/shapes.json';
import family from './assets/family.json';
import endingPhrases from './assets/ending-phrases.json';

interface Shape {
  name: string;
}

function App() {
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [gridCards, setGridCards] = useState<string[]>([]);
  // track which cards are face-up
  const [flipped, setFlipped] = useState<boolean[]>([]);
  // track which cards are disabled (prevent click)
  const [disabledArr, setDisabledArr] = useState<boolean[]>([]);
  // store first selection by index instead of DOM element
  const [first, setFirst] = useState<{ index: number; shape: string } | undefined>();
  const getRandomEnding = () => {
    return Math.floor(Math.random() * 10) % endingPhrases.length;
  };

  const [endingIndex, setEndingIndex] = useState(getRandomEnding);
  const [disablePage, setDisablePage] = useState(false);

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

    setDisablePage(true);

    if (!first) {
      setFirst({ index, shape });
      setDisablePage(false);
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
          setDisablePage(false);
        }, 1000);
      } else {
        // match: keep both flipped and disabled
        setTimeout(() => {
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
          setDisablePage(false);
        }, 1000);
      }
    }
  }

  function speak(word: string) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  function pickCards(cardNames: string[]): string[] {
    const pickedCards: string[] = [];

    while (pickedCards.length < 3) {
      const rIndex = Math.floor(Math.random() * 10) % cardNames.length;
      if (!pickedCards.find(card => card == cardNames[rIndex])) pickedCards.push(cardNames[rIndex]);
    }

    return pickedCards;
  }

  useEffect(() => {
    const cardsToUse = family as string[]; //(Math.floor((Math.random() * 100) % 2) == 0 ? family : shapes) as string[];
    // Create pairs of shapes to ensure matching is possible
    const pickedCards = pickCards(cardsToUse);
    const cardPairs = [...pickedCards, ...pickedCards];
    // Shuffle the shapes
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setGridCards(shuffled);
    // initialize flipped/disabled arrays
    setFlipped(new Array(shuffled.length).fill(false));
    setDisabledArr(new Array(shuffled.length).fill(false));
  }, []);

  useEffect(() => {
    if (flipped.length != 0 && flipped.reduce((accum: boolean, currValue: boolean) => accum && currValue)) {
      speak(endingPhrases[endingIndex]);
      setEndingIndex(getRandomEnding);

      setTimeout(() => {
        setFlipped(new Array(6).fill(false));
        setDisabledArr(new Array(6).fill(false));
        setFirst(undefined);
        const cardsToUse = family as string[]; //(Math.floor((Math.random() * 100) % 2) == 0 ? family : shapes) as string[];
        const pickedCards = pickCards(cardsToUse);
        const cardPairs = [...pickedCards, ...pickedCards];
        // Shuffle the shapes
        const shuffled = cardPairs.sort(() => Math.random() - 0.5);
        setGridCards(shuffled);
      }, 4000);
    }
  }, flipped);

  return (
    <div className="grid-container">
      {gridCards.map((card, index) => (
        <div key={index} className="grid-item">
          <Card type="family" name={card} cards={cards} index={index} flipped={flipped[index]} disabled={disabledArr[index]} onClick={() => flipCard(index, card)} />
        </div>
      ))}
      {disablePage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.0)',
            cursor: 'not-allowed',
            zIndex: 9999,
          }}
        />
      )}{' '}
    </div>
  );
}

export default App;
