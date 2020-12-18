import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { AddressFormConfigurationProvider } from 'ish-shared/formly-address-forms/configurations/address-form-configuration.provider';
import { FormlyCustomModule } from 'ish-shared/formly/formly-custom.module';

import { FormlyAddressFormComponent } from './formly-address-form.component';

describe('Formly Address Form Component', () => {
  let component: FormlyAddressFormComponent;
  let fixture: ComponentFixture<FormlyAddressFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyAddressFormComponent],
      imports: [
        CoreStoreModule.forTesting(),
        FormlyCustomModule,
        FormlyModule.forRoot({}),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [AddressFormConfigurationProvider],
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
