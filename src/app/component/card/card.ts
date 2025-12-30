import { Component, Input } from '@angular/core';
import { Family } from '../cards/family/family';
import { Shape } from '../cards/shape/shape';

@Component({
  selector: 'card',
  imports: [Family, Shape],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() FaceValue: string = '';
  @Input() Type: string = 'family';
  @Input() FileName: string = '';
  IsFlipped: boolean = false;
  IsDisabled: boolean = false;

  public Flip = () => {
    this.IsFlipped = !this.IsFlipped;
    this.IsDisabled = !this.IsDisabled;
  };

  public setFaceValue(faceValue: string): this {
    this.FaceValue = faceValue;
    return this;
  }

  public setFileName(filename: string): this {
    this.FileName = filename;
    return this;
  }
}
