import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { ShellModule } from 'ish-shell/shell.module';

import { FieldTooltipComponent } from './components/field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './components/validation-message/validation-message';
import { hideRequiredMarkerExtension } from './extensions/hide-required-marker.extension';
import { testExtension } from './extensions/test-extension';
import { registerTranslateSelectOptionsExtension } from './extensions/translate-select-options.extension';
import { CaptchaFieldComponent } from './templates/catpcha-field/captcha-field.component';
import { InputFieldComponent } from './templates/input-field/input-field.component';
import { SelectFieldComponent } from './templates/select-field/select-field.component';
import { TextareaFieldComponent } from './templates/textarea-field/textarea-field.component';
import { HideIfNoOptionsWrapperComponent } from './wrappers/hide-if-no-options-wrapper/hide-if-no-options-wrapper';
import { HorizontalWrapperComponent } from './wrappers/horizontal-wrapper/horizontal-wrapper';
import { TextareaDescriptionWrapperComponent } from './wrappers/textarea-description-wrapper/textarea-description-wrapper';
import { ValidationWrapperComponent } from './wrappers/validation-wrapper/validation-wrapper';

@NgModule({
  imports: [
    CommonModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'ish-input-field',
          component: InputFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-select-field',
          component: SelectFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-textarea-field',
          component: TextareaFieldComponent,
          wrappers: ['form-field-horizontal', 'validation', 'textarea-description'],
        },
        { name: 'ish-captcha-field', component: CaptchaFieldComponent },
      ],
      wrappers: [
        { name: 'form-field-horizontal', component: HorizontalWrapperComponent },
        { name: 'textarea-description', component: TextareaDescriptionWrapperComponent },
        { name: 'validation', component: ValidationWrapperComponent },
        { name: 'hide-if-no-options', component: HideIfNoOptionsWrapperComponent },
      ],
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
        { name: 'test-extension', extension: testExtension },
      ],
    }),
    FormlySelectModule,
    IconModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    ShellModule,
    TranslateModule,
  ],
  declarations: [
    CaptchaFieldComponent,
    FieldTooltipComponent,
    HorizontalWrapperComponent,
    InputFieldComponent,
    SelectFieldComponent,
    TextareaDescriptionWrapperComponent,
    TextareaFieldComponent,
    ValidationIconsComponent,
    ValidationMessageComponent,
    ValidationWrapperComponent,
  ],
  providers: [
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateSelectOptionsExtension,
      deps: [TranslateService],
    },
  ],
  exports: [CaptchaFieldComponent, InputFieldComponent, SelectFieldComponent, TextareaFieldComponent],
})
export class FormlyCustomModule {}
