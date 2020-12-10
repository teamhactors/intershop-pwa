import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCatpchaFieldComponent } from './custom-catpcha-field.component';

describe('Custom Catpcha Field Component', () => {
  let component: CustomCatpchaFieldComponent;
  let fixture: ComponentFixture<CustomCatpchaFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomCatpchaFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCatpchaFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
