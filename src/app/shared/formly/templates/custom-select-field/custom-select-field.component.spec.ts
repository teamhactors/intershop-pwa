import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectFieldComponent } from './custom-select-field.component';

describe('Custom Select Field Component', () => {
  let component: CustomSelectFieldComponent;
  let fixture: ComponentFixture<CustomSelectFieldComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSelectFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectFieldComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
