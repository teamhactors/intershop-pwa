import { Injectable } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';

import { FormlyHelper } from './formly.helper';

export class CreateFieldConfig {
  key: string;
  label: string;
  required?: boolean;
  template?: {
    forceRequiredStar?: boolean;
    labelClass?: string;
    fieldClass?: string;
    fieldsetMargin?: boolean;
    tooltip?: {
      title?: string;
      text: string;
      link: string;
    };
  };
  validators?: ValidatorFn[];
  errorMessages?: { [error: string]: string };
}

export type SelectOptionsSource =
  | Observable<{ value: number | string; label: string }[]>
  | { value: number | string; label: string }[];

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
        validation: [Validators.email],
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
        template: {
          forceRequiredStar: true,
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
          fieldsetMargin: true,
        },
        errorMessages: { required: 'account.address.country.error.default' },
      },
      this.appFacade
        .countries$()
        ?.pipe(map(countries => countries?.map(country => ({ value: country.countryCode, label: country.name })))),
      'account.option.select.text'
    );
  }

  createRegionsSelectField(key = 'region', countryCode: string, countryCodeKey = 'countryCode'): FormlyFieldConfig {
    const selectField = this.createSelectField(
      {
        key,
        label: 'account.default_address.state.label',
        required: true,
        template: {
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
        },
        errorMessages: { required: 'account.address.state.error.default' },
      },
      !!countryCode && countryCode !== 'default'
        ? this.appFacade
            .regions$(countryCode)
            .pipe(map(regions => regions?.map(region => ({ value: region.regionCode, label: region.name }))))
        : [],
      'account.option.select.text'
    );
    return {
      ...selectField,
      hideExpression: (model: { [key: string]: unknown }, _: unknown, field: FormlyFieldConfig) => {
        console.log('hideExpression eval');
        if (!model[countryCodeKey]) {
          return true;
        }
        if (!FormlyHelper.hasOptions(field)) {
          return true;
        }
        return false;
      },
    };
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
        labelClass: config.template?.labelClass ?? 'col-5',
        fieldClass: config.template?.fieldClass ?? 'col-7',
        fieldsetMargin: config.template?.fieldsetMargin ?? false,
        tooltip: config.template?.tooltip,
      },
      validators: {
        validation: config.validators ?? [],
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
