import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { Region } from 'ish-core/models/region/region.model';
import { AddressFormConfigurationProvider } from 'ish-shared/formly-address-forms/configurations/address-form-configuration.provider';

@Component({
  selector: 'ish-formly-address-form',
  templateUrl: './formly-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAddressFormComponent implements OnInit {
  @Input() parentForm: FormGroup;

  /** WIP */
  @Input() countryCode: string;
  @Input() regions: Observable<Region[]>;
  @Input() titles: string[];

  addressForm = new FormGroup({});
  model = this.afcProvider.getConfiguration().getModel();
  fields: FormlyFieldConfig[] = this.afcProvider.getConfiguration().getFieldConfiguration();

  constructor(private afcProvider: AddressFormConfigurationProvider) {}

  ngOnInit(): void {}

  submitForm() {
    console.log(this.model);
  }
}
