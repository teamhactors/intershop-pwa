import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AddressFormConfiguration } from 'ish-shared/formly-address-forms/configurations/address-form.configuration';

@Injectable()
export class AddressFormDEConfiguration extends AddressFormConfiguration {
  countryCode = 'DE';

  getModel(model: { [key: string]: unknown } = {}): { [key: string]: unknown } {
    return { ...model };
  }

  getFieldConfiguration(): FormlyFieldConfig[] {
    return [];
  }
}
