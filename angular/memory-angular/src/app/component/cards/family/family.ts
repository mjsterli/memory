import { Component, Input } from '@angular/core';

@Component({
  selector: 'family',
  imports: [],
  templateUrl: './family.html',
  styleUrl: './family.css',
})
export class Family {
  @Input() FamilyMemberName!: string;
  @Input() FileName!: string;
}
