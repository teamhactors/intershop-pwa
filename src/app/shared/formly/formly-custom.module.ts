import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';

import { HorizontalWrapperComponent } from './components/formly-horizontal-wrapper';
import { ValidationIconsComponent } from './components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './components/validation-message';
import { hideRequiredMarkerExtension } from './extensions/hide-required-marker.extension';
import { registerTranslateSelectOptionsExtension } from './extensions/translate-select-options.extension';
import { CustomInputFieldComponent } from './templates/custom-input-field/custom-input-field.component';
import { CustomSelectFieldComponent } from './templates/custom-select-field/custom-select-field.component';
import { CustomTextareaFieldComponent } from './templates/custom-textarea-field/custom-textarea-field.component';

@NgModule({
  imports: [
    CommonModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'custom-input',
          component: CustomInputFieldComponent,
          wrappers: ['form-field-horizontal'],
        },
        {
          name: 'custom-select',
          component: CustomSelectFieldComponent,
          wrappers: ['form-field-horizontal'],
        },
        {
          name: 'custom-textarea',
          component: CustomTextareaFieldComponent,
          wrappers: ['form-field-horizontal'],
        },
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
    TranslateModule,
  ],
  providers: [
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateSelectOptionsExtension,
      deps: [TranslateService],
    },
  ],
  declarations: [
    CustomInputFieldComponent,
    CustomSelectFieldComponent,
    CustomTextareaFieldComponent,
    HorizontalWrapperComponent,
    ValidationIconsComponent,
    ValidationMessageComponent,
  ],
  exports: [CustomInputFieldComponent, CustomSelectFieldComponent, CustomTextareaFieldComponent],
})
export class FormlyCustomModule {}
