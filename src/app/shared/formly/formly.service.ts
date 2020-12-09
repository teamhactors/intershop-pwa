import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      type: 'custom-input',
      templateOptions: {
        ...generalField.templateOptions,
      },
    };
  }

  createTextAreaField(config: CreateFieldConfig, rows: number = 5, maxLength: number = 30000): FormlyFieldConfig {
    const generalFormField = this.createGeneralFormField(config);
    return {
      ...generalFormField,
      type: 'custom-textarea',
      templateOptions: {
        ...generalFormField.templateOptions,
        maxLength,
        rows,
      },
      expressionProperties: {
        ...generalFormField.expressionProperties,
        'templateOptions.description': (_model, _formState, field) =>
          this.translate.instant('textarea.max_limit', {
            0: field.templateOptions.maxLength - (field.model[field.key as string] as string).length,
          }),
      },
    };
  }

  createSelectField(
    config: CreateFieldConfig,
    optionsSource: Observable<{ value: number | string; label: string }[]> | { value: number | string; label: string }[]
  ): FormlyFieldConfig {
    const generalField = this.createGeneralFormField(config);
    let options;
    if (isObservable(optionsSource)) {
      options = optionsSource.pipe(
        map(subjects => [{ value: null, label: 'account.option.select.text' }].concat(subjects))
      );
    } else {
      options = [{ value: null, label: 'account.option.select.text' }].concat(optionsSource);
    }
    return {
      ...generalField,
      type: 'custom-select',
      defaultValue: null,
      templateOptions: {
        ...generalField.templateOptions,
        options,
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
