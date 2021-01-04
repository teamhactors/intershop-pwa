import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AddressFormConfiguration } from 'ish-shared/formly-address-forms/configurations/address-form.configuration';
import { FormlyService } from 'ish-shared/formly/formly.service';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Injectable()
export class AddressFormDefaultConfiguration extends AddressFormConfiguration {
  countryCode = 'default';

  constructor(private formly: FormlyService) {
    super();
  }

  getModel(model: { [key: string]: unknown } = {}): { [key: string]: unknown } {
    return {
      companyName1: model.companyName1 ?? '',
      companyName2: model.companyName2 ?? '',
      firstName: model.firstName ?? '',
      lastName: model.lastName ?? '',
      addressLine1: model.addressLine1 ?? '',
      addressLine2: model.addressLine2 ?? '',
      postalCode: model.postalCode ?? '',
      city: model.city ?? '',
      region: model.region ?? '',
      phone: model.phone ?? '',
    };
  }

  getFieldConfiguration(countryCode?: string): FormlyFieldConfig[] {
    return [
      this.formly.createInputField({
        key: 'companyName1',
        label: 'account.address.company_name.label',
        required: true,
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8' },
        errorMessages: { required: 'account.address.company_name.error.required' },
      }),
      this.formly.createInputField({
        key: 'companyName2',
        label: 'account.address.company_name_2.label',
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8', fieldsetMargin: true },
      }),
      this.formly.createInputField({
        key: 'firstName',
        label: 'account.default_address.firstname.label',
        required: true,
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8' },
        validators: [SpecialValidators.noSpecialChars],
        errorMessages: {
          required: 'account.address.firstname.missing.error',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      }),
      this.formly.createInputField({
        key: 'lastName',
        label: 'account.default_address.lastname.label',
        required: true,
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8', fieldsetMargin: true },
        validators: [SpecialValidators.noSpecialChars],
        errorMessages: {
          required: 'account.address.lastname.missing.error',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      }),
      this.formly.createInputField({
        key: 'addressLine1',
        label: 'account.default_address.street.label',
        required: true,
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8' },
        errorMessages: { required: 'account.address.address1.missing.error' },
      }),
      this.formly.createInputField({
        key: 'addressLine2',
        label: 'account.default_address.street2.label',
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8', fieldsetMargin: true },
      }),
      this.formly.createInputField({
        key: 'postalCode',
        label: 'account.default_address.postalcode.label',
        required: true,
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8' },
        errorMessages: { required: 'account.address.postalcode.missing.error' },
      }),
      this.formly.createInputField({
        key: 'city',
        label: 'account.default_address.city.label',
        required: true,
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8', fieldsetMargin: true },
        errorMessages: { required: 'account.address.city.missing.error' },
      }),
      this.formly.createRegionsSelectField('region', countryCode),
      this.formly.createInputField({
        key: 'phone',
        label: 'account.profile.phone.label',
        template: { labelClass: 'col-md-4', fieldClass: 'col-md-8' },
      }),
    ];
  }
}
