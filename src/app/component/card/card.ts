import { Component, Input, WritableSignal, signal } from '@angular/core';
import { Family } from '../cards/family/family';
import { Shape } from '../cards/shape/shape';

// Data model class
export class CardModel {
  FaceValue: string = '';
  Type: string = 'family';
  FileName: string = '';
  CardDesign: string = '';
  IsFlipped: WritableSignal<boolean> = signal(false);
  IsDisabled: WritableSignal<boolean> = signal(false);

  public Flip = () => {
    this.IsFlipped.update(isFlipped => !isFlipped);
    this.IsDisabled.update(isDisabled => !isDisabled);
  };

  public setFaceValue(faceValue: string): this {
    this.FaceValue = faceValue;
    return this;
  }

  public setFileName(filename: string): this {
    this.FileName = filename;
    return this;
  }

  public setCardDesign(filename: string): this {
    this.CardDesign = filename;
    return this;
  }
}

// Component for rendering
@Component({
  selector: 'card',
  imports: [Family, Shape],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() cardData!: CardModel;

  get FaceValue() {
    return this.cardData.FaceValue;
  }

  get FileName() {
    return this.cardData.FileName;
  }

  get IsFlipped() {
    return this.cardData.IsFlipped;
  }

  get IsDisabled() {
    return this.cardData.IsDisabled;
  }

  get CardDesign(){
    return this.cardData.CardDesign;
  }

  Flip() {
    this.cardData.Flip();
  }
}
