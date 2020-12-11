import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class CreateFieldConfig {
  key: string;
  label: string;
  required?: boolean;
  errorMessages?: { [error: string]: string };
}

const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

@Injectable({
  providedIn: 'root',
})
export class FormlyService {
  constructor(private translate: TranslateService) {}

  createInputField(config: CreateFieldConfig): FormlyFieldConfig {
    const generalField = this.createGeneralFormField(config);
    return {
      ...generalField,
      type: 'ish-input-field',
      templateOptions: {
        ...generalField.templateOptions,
      },
    };
  }

  createTextAreaField(config: CreateFieldConfig, rows: number = 5, maxLength: number = 30000): FormlyFieldConfig {
    const generalFormField = this.createGeneralFormField(config);
    return {
      ...generalFormField,
      type: 'ish-textarea-field',
      templateOptions: {
        ...generalFormField.templateOptions,
        maxLength,
        rows,
      },
      expressionProperties: {
        ...generalFormField.expressionProperties,
        // tslint:disable-next-line:variable-name
        'templateOptions.description': (_model, _formState, field) =>
          this.translate.instant('textarea.max_limit', {
            0: field.templateOptions.maxLength - (field.model[field.key as string] as string).length,
          }),
      },
    };
  }

  createSelectField(
    config: CreateFieldConfig,
    optionsSource?:
      | Observable<{ value: number | string; label: string }[]>
      | { value: number | string; label: string }[]
  ): FormlyFieldConfig {
    const generalField = this.createGeneralFormField(config);
    return {
      ...generalField,
      type: 'ish-select-field',
      // tslint:disable-next-line:no-null-keyword
      defaultValue: null,
      templateOptions: {
        ...generalField.templateOptions,
        options: optionsSource,
      },
    };
  }

  createEmailField(config: CreateFieldConfig): FormlyFieldConfig {
    const inputField = this.createInputField(config);
    return {
      ...inputField,
      validators: {
        ...inputField.validators,
        email: {
          expression: c => EMAIL_REGEXP.test(c.value),
        },
      },
    };
  }

  createCaptchaField(topic: string): FormlyFieldConfig {
    return {
      type: 'ish-captcha-field',
      templateOptions: {
        topic,
      },
      hooks: {
        onInit: field => {
          field.form.addControl('captcha', new FormControl(''));
          field.form.addControl('captchaAction', new FormControl(topic));
        },
      },
    };
  }

  private createGeneralFormField(config: CreateFieldConfig): FormlyFieldConfig {
    return {
      key: config.key,
      templateOptions: {
        label: config.label,
        required: config.required ?? false,
      },
      validation: {
        messages: config.errorMessages,
      },
    };
  }
}
