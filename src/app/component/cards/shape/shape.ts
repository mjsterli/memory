import { Component, Input } from '@angular/core';

@Component({
  selector: 'shape',
  imports: [],
  templateUrl: './shape.html',
  styleUrl: './shape.css',
})
export class Shape {
  @Input() ShapeName!: string;
}
