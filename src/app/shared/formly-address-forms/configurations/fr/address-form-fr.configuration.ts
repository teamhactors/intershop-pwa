import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AddressFormConfiguration } from 'ish-shared/formly-address-forms/configurations/address-form.configuration';
import { FormlyService } from 'ish-shared/formly/formly.service';
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';

@Injectable()
export class AddressFormFRConfiguration extends AddressFormConfiguration {
  countryCode = 'FR';

  constructor(private formly: FormlyService) {
    super();
  }

  getModel(model: { [key: string]: unknown } = {}): { [key: string]: unknown } {
    return {
      companyName1: model.companyName1 ?? '',
      companyName2: model.companyName2 ?? '',
      title: undefined,
      firstName: model.firstName ?? '',
      lastName: model.lastName ?? '',
      addressLine1: model.addressLine1 ?? '',
      addressLine2: model.addressLine2 ?? '',
      postalCode: model.postalCode ?? '',
      city: model.city ?? '',
      phone: model.phone ?? '',
    };
  }

  getFieldConfiguration(): FormlyFieldConfig[] {
    return [
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
        fieldsetMargin: true,
      }),
      this.formly.createSelectField(
        {
          key: 'title',
          label: 'account.default_address.title.label',
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
        },
        determineSalutations(this.countryCode).map(salutation => ({ value: salutation, label: salutation })),
        'account.option.select.text'
      ),
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
        fieldsetMargin: true,
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
        fieldsetMargin: true,
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
        fieldsetMargin: true,
        errorMessages: { required: 'account.address.city.missing.error' },
      }),
      this.formly.createInputField({
        key: 'phone',
        label: 'account.profile.phone.label',
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
      }),
    ];
  }
}
