import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyAddressFormComponent } from './formly-address-form.component';

describe('Formly Address Form Component', () => {
  let component: FormlyAddressFormComponent;
  let fixture: ComponentFixture<FormlyAddressFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyAddressFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyAddressFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
