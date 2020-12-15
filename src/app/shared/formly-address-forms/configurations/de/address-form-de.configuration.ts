import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { AddressFormConfiguration } from 'ish-shared/formly-address-forms/configurations/address-form.configuration';
import { FormlyHelper } from 'ish-shared/formly/formly.helper';
import { FormlyService } from 'ish-shared/formly/formly.service';
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';

@Injectable()
export class AddressFormDEConfiguration extends AddressFormConfiguration {
  countryCode = 'DE';

  constructor(private formly: FormlyService, private appFacade: AppFacade) {
    super();
  }

  getModel(model: { [key: string]: unknown } = {}): { [key: string]: unknown } {
    return {
      ...model,
      countryCode: model.countryCode ?? '',
      title: undefined,
      companyName1: model.companyName1 ?? '',
      companyName2: model.companyName2 ?? '',
      firstName: model.firstName ?? '',
      lastName: model.lastName ?? '',
      addressLine1: model.addressLine1 ?? '',
      addressLine2: model.addressLine2 ?? '',
      postalCode: model.postalCode ?? '',
      city: model.city ?? '',
      state: model.state ?? '',
    };
  }

  getFieldConfiguration(): FormlyFieldConfig[] {
    const fieldConfig = [
      this.formly.createSelectField({
        key: 'countryCode',
        label: 'account.address.country.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.country.error.default' },
      }),
      this.formly.createSelectField({
        key: 'title',
        label: 'account.default_address.title.label',
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
      }),
      this.formly.createInputField({
        key: 'companyName1',
        label: 'account.address.company_name.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.company_name.error.required' },
      }),
      this.formly.createInputField({
        key: 'companyName2',
        label: 'account.address.company_name_2.label',
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
      }),
      this.formly.createInputField({
        key: 'firstName',
        label: 'account.default_address.firstname.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: {
          required: 'account.address.firstname.missing.error',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      }),
      this.formly.createInputField({
        key: 'lastName',
        label: 'account.default_address.lastname.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: {
          required: 'account.address.lastname.missing.error',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      }),
      this.formly.createInputField({
        key: 'addressLine1',
        label: 'account.default_address.street.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.address1.missing.error' },
      }),
      this.formly.createInputField({
        key: 'addressLine2',
        label: 'account.default_address.street2.label',
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
      }),
      this.formly.createInputField({
        key: 'postalCode',
        label: 'account.default_address.postalcode.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.postalcode.missing.error' },
      }),
      this.formly.createInputField({
        key: 'city',
        label: 'account.default_address.city.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.city.missing.error' },
      }),
      this.formly.createSelectField({
        key: 'state',
        label: 'account.default_address.state.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.state.error.default' },
      }),
    ];

    const countryIndex = FormlyHelper.findFieldIndex('countryCode', fieldConfig);
    if (countryIndex !== -1) {
      fieldConfig[countryIndex] = FormlyHelper.updateSelectOptionsSource(
        fieldConfig[countryIndex],
        this.appFacade
          .countries$()
          ?.pipe(map(countries => countries?.map(country => ({ value: country.countryCode, label: country.name })))),
        'account.option.select.text'
      );
    }

    const titleIndex = FormlyHelper.findFieldIndex('title', fieldConfig);
    if (titleIndex !== -1) {
      fieldConfig[titleIndex] = FormlyHelper.updateSelectOptionsSource(
        fieldConfig[titleIndex],
        determineSalutations(this.countryCode).map(salutation => ({ value: salutation, label: salutation })),
        'account.option.select.text'
      );
    }

    // const regionIndex = FormlyHelper.findFieldIndex('state', this.fields);
    // if (regionIndex !== -1) {
    //   this.fields[regionIndex] = FormlyHelper.updateSelectOptionsSource(
    //     this.fields[regionIndex],
    //     this.regions?.pipe(map(regions => regions?.map(region => ({ value: region.id, label: region.name }))))
    //   );
    // }

    return fieldConfig;
  }
}
