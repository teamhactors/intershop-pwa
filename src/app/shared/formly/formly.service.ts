import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';

export class CreateFieldConfig {
  key: string;
  label: string;
  required?: boolean;
  forceRequiredStar?: boolean;
  errorMessages?: { [error: string]: string };
  labelClass?: string;
  fieldClass?: string;
  fieldsetMargin?: boolean;
}

export type SelectOptionsSource =
  | Observable<{ value: number | string; label: string }[]>
  | { value: number | string; label: string }[];

const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

@Injectable({
  providedIn: 'root',
})
export class FormlyService {
  constructor(private translate: TranslateService, private appFacade: AppFacade) {}

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
    optionsSource?: SelectOptionsSource,
    placeholder?: string
  ): FormlyFieldConfig {
    const generalField = this.createGeneralFormField(config);
    return {
      ...generalField,
      type: 'ish-select-field',
      // tslint:disable-next-line:no-null-keyword
      defaultValue: null,
      templateOptions: {
        ...generalField.templateOptions,
        options: this.translateSelectOptionsAndAddPlaceholder(optionsSource, placeholder),
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

  createCountrySelectField(key = 'countryCode'): FormlyFieldConfig {
    return this.createSelectField(
      {
        key,
        label: 'account.address.country.label',
        required: true,
        forceRequiredStar: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.country.error.default' },
        fieldsetMargin: true,
      },
      this.appFacade
        .countries$()
        ?.pipe(map(countries => countries?.map(country => ({ value: country.countryCode, label: country.name })))),
      'account.option.select.text'
    );
  }

  updateSelectFieldOptions(
    field: FormlyFieldConfig,
    optionsSource: SelectOptionsSource,
    placeholder?: string
  ): FormlyFieldConfig {
    return {
      ...field,
      templateOptions: {
        ...field.templateOptions,
        options: this.translateSelectOptionsAndAddPlaceholder(optionsSource, placeholder),
      },
    };
  }

  private createGeneralFormField(config: CreateFieldConfig): FormlyFieldConfig {
    return {
      key: config.key,
      templateOptions: {
        label: config.label,
        required: config.required ?? false,
        forceRequiredStar: config.required ?? false,
        labelClass: config.labelClass ?? 'col-5',
        fieldClass: config.fieldClass ?? 'col-7',
        fieldsetMargin: config.fieldsetMargin ?? false,
      },
      validation: {
        messages: config.errorMessages,
      },
    };
  }

  private translateSelectOptionsAndAddPlaceholder(
    optionsSource: SelectOptionsSource,
    placeholder?: string
  ): SelectOptionsSource | undefined {
    if (!optionsSource) {
      return;
    }
    let opts$: SelectOptionsSource;
    if (isObservable(optionsSource)) {
      opts$ = optionsSource.pipe(
        // tslint:disable-next-line:no-null-keyword
        map(options => (placeholder ? [{ value: null, label: placeholder }] : []).concat(options ?? [])),
        map(options => options?.map(option => ({ ...option, label: this.translate.instant(option.label) })))
      );
    } else {
      // tslint:disable-next-line:no-null-keyword
      opts$ = (placeholder ? [{ value: null, label: placeholder }] : [])
        .concat(optionsSource)
        .map(option => ({ ...option, label: this.translate.instant(option.label) }));
    }
    return opts$;
  }
}
