import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Card, CardModel } from './component/card/card';
import { Family } from './component/cards/family/family';
import { Shape } from './component/cards/shape/shape';
import { CategoryPicker } from './component/category-picker/category-picker';
import family from '../assets/family.json';
import endingPhrases from '../assets/ending-phrases.json';
import cardDesigns from '../assets/card-designs.json';

export interface CardData {
  faceValue: string;
  fileName: string;
}

@Component({
  selector: 'app-root',
  imports: [Card, Family, Shape, CategoryPicker],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('memory-angular');
  Cards: WritableSignal<CardModel[]> = signal<CardModel[]>([]);
  IsPageDisabled: WritableSignal<boolean> = signal(false);
  #firstPicked: CardModel | null = null;

  FlipCard(card: CardModel): void {
    // ignore clicks on already flipped card
    if (card.IsFlipped()) return;

    this.speak(card.FaceValue);
    
    // flip this card face-up and disable it immediately to avoid double-click
    card.Flip();
    this.IsPageDisabled.set(true);

    if (!this.#firstPicked) {
      this.#firstPicked = card;
      this.IsPageDisabled.set(false);
    } else {
      // second selection
      if (this.#firstPicked.FileName !== card.FileName) {
        // mismatch: flip both back after a delay and re-enable
        setTimeout(() => {
          this.#firstPicked?.Flip();
          card.Flip();
          this.#firstPicked = null;
          this.IsPageDisabled.set(false);
        }, 1000);
      } else {
        // match: keep both flipped and disabled
        setTimeout(() => {
          this.#firstPicked = null;
          this.IsPageDisabled.set(false);

          if(this.Cards().every(card => card.IsFlipped())) {
            this.speak(endingPhrases[this.getRandomEnding()]);
            this.resetGame()};
        }, 1000);
      }
    }
  }

  speak(word: string): void {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  getCardDesign() {
    return `${cardDesigns[Math.floor(Math.random() * 10) % cardDesigns.length]}.png`;
  }

  pickCards(cardNames: CardData[]): CardModel[] {
    const pickedCards: CardModel[] = [];
    const cardDesignFileName = this.getCardDesign();

    while (pickedCards.length < 6) {
      const rIndex = Math.floor(Math.random() * 100) % cardNames.length;
      if (!pickedCards.find(card => card.FileName == cardNames[rIndex].fileName)) {
        let { faceValue, fileName } = cardNames[rIndex];
        pickedCards.push(new CardModel()
        .setFaceValue(faceValue)
        .setFileName(fileName)
        .setCardDesign(cardDesignFileName));

        pickedCards.push(new CardModel()
        .setFaceValue(faceValue)
        .setFileName(fileName)
        .setCardDesign(cardDesignFileName));
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

  getRandomEnding() {
    return Math.floor(Math.random() * 10) % endingPhrases.length;
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
