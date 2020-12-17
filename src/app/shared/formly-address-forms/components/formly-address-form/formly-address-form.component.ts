import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AddressFormConfigurationProvider } from 'ish-shared/formly-address-forms/configurations/address-form-configuration.provider';
import { FormlyService } from 'ish-shared/formly/formly.service';
import { markAsPristineRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-formly-address-form',
  templateUrl: './formly-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyAddressFormComponent implements OnInit {
  @Input() parentForm: FormGroup;

  countryCode = '';

  countryForm = new FormGroup({});
  countryModel = {
    countryCode: '',
  };
  countryFields = [this.formly.createCountrySelectField()];

  addressForm = new FormGroup({});
  addressModel = this.afcProvider.getConfiguration().getModel();
  addressFields: FormlyFieldConfig[] = this.afcProvider.getConfiguration().getFieldConfiguration();

  constructor(private formly: FormlyService, private afcProvider: AddressFormConfigurationProvider) {}

  ngOnInit(): void {
    this.parentForm?.setControl('address', this.addressForm);
    this.addressForm.setParent(this.parentForm);
  }

  handleCountryChange(model: { countryCode: string }) {
    if (model.countryCode && model.countryCode !== this.countryCode) {
      this.countryCode = model.countryCode;

      const configuration = this.afcProvider.getConfiguration(model.countryCode);
      this.addressModel = configuration.getModel(this.addressModel);
      this.addressFields = configuration.getFieldConfiguration();

      const countryCodeControl = this.countryForm.get('countryCode');
      markAsPristineRecursive(this.addressForm);
      countryCodeControl.markAsDirty();
      countryCodeControl.updateValueAndValidity();

      this.addressForm.setControl('countryCode', countryCodeControl);
    }
  }
}
