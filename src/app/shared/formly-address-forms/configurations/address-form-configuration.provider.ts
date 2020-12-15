import { Inject, Injectable, InjectionToken } from '@angular/core';

import { AddressFormConfiguration } from './address-form.configuration';

export const ADDRESS_FORM_CONFIGURATION = new InjectionToken<AddressFormConfiguration>('Address Form Factory');

@Injectable()
export class AddressFormConfigurationProvider {
  constructor(@Inject(ADDRESS_FORM_CONFIGURATION) private configurations: AddressFormConfiguration[]) {}

  /**
   * gets the appropriate address configuration for the given countryCode
   */
  getConfiguration(countryCode: string = 'default'): AddressFormConfiguration {
    let configuration = this.findConfiguration(countryCode);
    if (!configuration) {
      configuration = this.findConfiguration('default');
    }
    return configuration;
  }

  private findConfiguration(countryCode: string): AddressFormConfiguration {
    return this.configurations.find(f => f.countryCode === countryCode);
  }
}
