import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { ShellModule } from 'ish-shell/shell.module';

import { HorizontalWrapperComponent } from './components/horizontal-wrapper/horizontal-wrapper';
import { ValidationIconsComponent } from './components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './components/validation-message/validation-message';
import { hideRequiredMarkerExtension } from './extensions/hide-required-marker.extension';
import { CaptchaFieldComponent } from './templates/catpcha-field/captcha-field.component';
import { InputFieldComponent } from './templates/input-field/input-field.component';
import { SelectFieldComponent } from './templates/select-field/select-field.component';
import { TextareaFieldComponent } from './templates/textarea-field/textarea-field.component';

@NgModule({
  imports: [
    CommonModule,
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
      wrappers: [{ name: 'form-field-horizontal', component: HorizontalWrapperComponent }],
      extras: {
        lazyRender: true,
        showError: field =>
          field.formControl &&
          field.formControl.invalid &&
          (field.formControl.dirty ||
            (field.options.parentForm && field.options.parentForm.submitted) ||
            !!(field.field.validation && field.field.validation.show)),
      },
      extensions: [
        {
          name: 'hide-required-marker',
          extension: hideRequiredMarkerExtension,
        },
      ],
    }),
    FormlySelectModule,
    IconModule,
    ReactiveFormsModule,
    ShellModule,
    TranslateModule,
  ],
  declarations: [
    CaptchaFieldComponent,
    HorizontalWrapperComponent,
    InputFieldComponent,
    SelectFieldComponent,
    TextareaFieldComponent,
    ValidationIconsComponent,
    ValidationMessageComponent,
  ],
  exports: [CaptchaFieldComponent, InputFieldComponent, SelectFieldComponent, TextareaFieldComponent],
})
export class FormlyCustomModule {}
