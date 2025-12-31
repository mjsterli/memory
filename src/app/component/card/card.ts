import { Component, Input, WritableSignal, signal } from '@angular/core';
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
  @Input() IsFlipped: WritableSignal<boolean> = signal(false);
  @Input() IsDisabled: WritableSignal<boolean> = signal(false);

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
}
