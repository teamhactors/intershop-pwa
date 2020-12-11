import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';

import { InputFieldComponent } from './input-field.component';

let testComponentInputs;

describe('Input Field Component', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputFieldComponent, TestComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-input-field',
              component: InputFieldComponent,
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
          key: 'input',
          type: 'ish-input-field',
          templateOptions: {
            label: 'test label',
            required: true,
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
    expect(element.querySelector('ish-input-field > input')).toBeTruthy();
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
