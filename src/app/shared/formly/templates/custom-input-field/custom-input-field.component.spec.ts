import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputFieldComponent } from './custom-input-field.component';

describe('Custom Input Field Component', () => {
  let component: CustomInputFieldComponent;
  let fixture: ComponentFixture<CustomInputFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomInputFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomInputFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
