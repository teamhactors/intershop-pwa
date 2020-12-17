import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { AddressFormConfiguration } from 'ish-shared/formly-address-forms/configurations/address-form.configuration';
import { FormlyService } from 'ish-shared/formly/formly.service';

@Injectable()
export class AddressFormUSConfiguration extends AddressFormConfiguration {
  countryCode = 'US';

  constructor(private formly: FormlyService, private appFacade: AppFacade) {
    super();
  }

  getModel(model: { [key: string]: unknown } = {}): { [key: string]: unknown } {
    return {
      countryCode: model.countryCode ?? '',
      companyName1: model.companyName1 ?? '',
      companyName2: model.companyName2 ?? '',
      firstName: model.firstName ?? '',
      lastName: model.lastName ?? '',
      addressLine1: model.addressLine1 ?? '',
      addressLine2: model.addressLine2 ?? '',
      state: undefined,
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
        key: 'city',
        label: 'account.default_address.city.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.city.missing.error' },
      }),
      this.formly.createSelectField(
        {
          key: 'state',
          label: 'account.default_address.state.label',
          required: true,
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
          errorMessages: { required: 'account.address.state.error.default' },
        },
        this.appFacade
          .regions$(this.countryCode)
          .pipe(map(regions => regions?.map(region => ({ value: region.id, label: region.name })))),
        'account.option.select.text'
      ),
      this.formly.createInputField({
        key: 'postalCode',
        label: 'account.default_address.postalcode.label',
        required: true,
        labelClass: 'col-md-4',
        fieldClass: 'col-md-8',
        errorMessages: { required: 'account.address.postalcode.missing.error' },
      }),
    ];
  }
}
