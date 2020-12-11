import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, spy, verify } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { FormlyCustomModule } from 'ish-shared/formly/formly-custom.module';
import { FormlyService } from 'ish-shared/formly/formly.service';
import { CaptchaFieldComponent } from 'ish-shared/formly/templates/catpcha-field/captcha-field.component';
import { InputFieldComponent } from 'ish-shared/formly/templates/input-field/input-field.component';
import { SelectFieldComponent } from 'ish-shared/formly/templates/select-field/select-field.component';
import { TextareaFieldComponent } from 'ish-shared/formly/templates/textarea-field/textarea-field.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectComponent } from 'ish-shared/forms/components/select/select.component';
import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { LazyCaptchaComponent } from '../../../extensions/captcha/exports/lazy-captcha/lazy-captcha.component';

import { ContactFormComponent } from './contact-form.component';

describe('Contact Form Component', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ContactFormComponent,
        MockComponent(InputComponent),
        MockComponent(LazyCaptchaComponent),
        MockComponent(SelectComponent),
        MockComponent(TextareaComponent),
      ],
      imports: [
        CoreStoreModule.forTesting(),
        FormlyCustomModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-input-field',
              component: InputFieldComponent,
              wrappers: ['form-field-horizontal'],
            },
            {
              name: 'ish-select-field',
              component: SelectFieldComponent,
              wrappers: ['form-field-horizontal'],
            },
            {
              name: 'ish-textarea-field',
              component: TextareaFieldComponent,
              wrappers: ['form-field-horizontal'],
            },
            { name: 'ish-captcha-field', component: CaptchaFieldComponent },
          ],
        }),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [FormlyService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.subjects = of(['subject1', 'subject2']);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not emit contact request when invalid form is submitted', () => {
    const emitter = spy(component.request);
    fixture.detectChanges();
    component.submitForm();
    verify(emitter.emit(anything())).never();
    expect(component.submitted).toBeTrue();
  });

  it('should emit contact request when valid form is submitted', () => {
    const emitter = spy(component.request);
    fixture.detectChanges();
    component.contactForm.get('name').setValue('Miller, Patricia');
    component.contactForm.get('email').setValue('pmiller@test.intershop.de');
    component.contactForm.get('phone').setValue('123456');
    component.contactForm.get('order').setValue('456789');
    component.contactForm.get('subject').setValue('Return');
    component.contactForm.get('comment').setValue('want to return stuff');
    component.submitForm();
    verify(emitter.emit(anything())).once();
  });
});
