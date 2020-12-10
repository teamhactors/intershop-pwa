import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTextareaFieldComponent } from './custom-textarea-field.component';

describe('Custom Textarea Field Component', () => {
  let component: CustomTextareaFieldComponent;
  let fixture: ComponentFixture<CustomTextareaFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomTextareaFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTextareaFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
