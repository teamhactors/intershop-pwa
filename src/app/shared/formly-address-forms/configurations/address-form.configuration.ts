import { FormlyFieldConfig } from '@ngx-formly/core';

export abstract class AddressFormConfiguration {
  countryCode = 'default';

  abstract getFieldConfiguration(): FormlyFieldConfig[];

  abstract getModel(model?: { [key: string]: unknown }): { [key: string]: unknown };
}
