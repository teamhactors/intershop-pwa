import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { SelectFieldComponent } from './select-field.component';

let testComponentInputs;

describe('Select Field Component', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectFieldComponent, TestComponent],
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-select-field',
              component: SelectFieldComponent,
            },
          ],
        }),
        FormlySelectModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testComponentInputs = {
      fields: [
        {
          key: 'select',
          type: 'ish-select-field',
          templateOptions: {
            label: 'test label',
            required: true,
            options: [{ value: 1, label: 'test' }],
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
    expect(element.querySelector('ish-select-field > select')).toBeTruthy();
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
