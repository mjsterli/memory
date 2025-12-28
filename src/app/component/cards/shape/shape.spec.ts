import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shape } from './shape';

describe('Shape', () => {
  let component: Shape;
  let fixture: ComponentFixture<Shape>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shape]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shape);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
