import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';
import { LazyCaptchaComponent } from 'src/app/extensions/captcha/exports/lazy-captcha/lazy-captcha.component';

import { CaptchaFieldComponent } from './captcha-field.component';

let testComponentInputs;

describe('Captcha Field Component', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaptchaFieldComponent, MockComponent(LazyCaptchaComponent), TestComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-captcha-field',
              component: CaptchaFieldComponent,
            },
          ],
        }),
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testComponentInputs = {
      fields: [
        {
          type: 'ish-captcha-field',
          templateOptions: {
            topic: 'test',
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
    };
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-captcha-field > ish-lazy-captcha')).toBeTruthy();
  });
});

@Component({
  template: '<formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>',
  entryComponents: [],
})
class TestComponent {
  @ViewChild(FormlyForm) formlyForm: FormlyForm;

  fields = testComponentInputs.fields;
  form = testComponentInputs.form;
  model = testComponentInputs.model || {};
  options = testComponentInputs.options;
}
