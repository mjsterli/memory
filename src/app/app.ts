import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Card } from './component/card/card';
import { Family } from './component/cards/family/family';
import { Shape } from './component/cards/shape/shape';
import family from '../assets/family.json';

export interface CardData {
  faceValue: string;
  fileName: string;
}

@Component({
  selector: 'app-root',
  imports: [Family, Shape],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('memory-angular');
  Cards: WritableSignal<Card[]> = signal<Card[]>([]);
  IsPageDisabled: boolean = false;
  #firstPicked: Card | null = null;

  flipCard(card: Card): void {
    // ignore clicks on already flipped card
    if (card.IsFlipped()) return;

    this.speak(card.FaceValue);
    // flip this card face-up and disable it immediately to avoid double-click
    card.Flip();
    this.IsPageDisabled = true;

    if (!this.#firstPicked) {
      this.#firstPicked = card;
    } else {
      // second selection
      if (this.#firstPicked.FileName !== card.FileName) {
        // mismatch: flip both back after a delay and re-enable
        setTimeout(() => {
          this.#firstPicked?.Flip();
          card.Flip();
          this.#firstPicked = null;
        }, 1000);
      } else {
        // match: keep both flipped and disabled
        setTimeout(() => {
          this.#firstPicked = null;
          this.IsPageDisabled = false;

          if(this.Cards().every(card => card.IsFlipped())) this.resetGame();
        }, 1000);
      }
    }
  }

  speak(word: string): void {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  pickCards(cardNames: CardData[]): Card[] {
    const pickedCards: Card[] = [];

    while (pickedCards.length < 6) {
      const rIndex = Math.floor(Math.random() * 100) % cardNames.length;
      if (!pickedCards.find(card => card.FileName == cardNames[rIndex].fileName)) {
        let { faceValue, fileName } = cardNames[rIndex];
        pickedCards.push(new Card()
        .setFaceValue(faceValue)
        .setFileName(fileName));
        
        pickedCards.push(new Card()
        .setFaceValue(faceValue)
        .setFileName(fileName));
      }
    }

    return pickedCards;
  }

  initializeCards(){
    const cardsToUse = family as CardData[]; //(Math.floor((Math.random() * 100) % 2) == 0 ? family : shapes) as string[];
    // Create pairs of shapes to ensure matching is possible
    // const pickedCards = this.pickCards(cardsToUse);
    const cardPairs = this.pickCards(cardsToUse);
    // const cardPairs = [...pickedCards, ...pickedCards];
    // Shuffle the shapes
    this.Cards.set(cardPairs.sort(() => Math.random() - 0.5));
  }

  resetGame(){
    //speak(endingPhrases[endingIndex]);
      setTimeout(() => {
        this.initializeCards();
      }, 4000);
    
  }

  ngOnInit(): void {
    this.initializeCards();
  }

  // useEffect(() => {
  //   const cardsToUse = family as string[]; //(Math.floor((Math.random() * 100) % 2) == 0 ? family : shapes) as string[];
  //   // Create pairs of shapes to ensure matching is possible
  //   const pickedCards = pickCards(cardsToUse);
  //   const cardPairs = [...pickedCards, ...pickedCards] as string[];
  //   // Shuffle the shapes
  //   const shuffled = cardPairs.sort(() => Math.random() - 0.5);
  //   setGridCards(shuffled);
  //   // initialize flipped/disabled arrays
  //   setFlipped(new Array(shuffled.length).fill(false));
  //   setDisabledArr(new Array(shuffled.length).fill(false));
  // }, []);

}
