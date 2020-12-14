import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Country } from 'ish-core/models/country/country.model';
import { Region } from 'ish-core/models/region/region.model';
import { FormlyHelper } from 'ish-shared/formly/formly.helper';
import { FormlyService } from 'ish-shared/formly/formly.service';

@Component({
  selector: 'ish-formly-address-form',
  templateUrl: './formly-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAddressFormComponent implements OnInit {
  @Input() countryCode: string;
  @Input() countries: Observable<Country[]>;
  @Input() regions: Observable<Region[]>;
  @Input() titles: string[];

  addressForm = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    this.formly.createSelectField({
      key: 'countryCode',
      label: 'account.address.country.label',
      required: true,
      errorMessages: { required: 'account.address.country.error.default' },
    }),
    this.formly.createInputField({
      key: 'companyName1',
      label: 'account.address.company_name.label',
      required: true,
      errorMessages: { required: 'account.address.company_name.error.required' },
    }),
    this.formly.createInputField({
      key: 'companyName2',
      label: 'account.address.company_name_2.label',
    }),
    this.formly.createInputField({
      key: 'firstName',
      label: 'account.default_address.firstname.label',
      required: true,
      errorMessages: {
        required: 'account.address.firstname.missing.error',
        noSpecialChars: 'account.name.error.forbidden.chars',
      },
    }),
    this.formly.createInputField({
      key: 'lastName',
      label: 'account.default_address.lastname.label',
      required: true,
      errorMessages: {
        required: 'account.address.lastname.missing.error',
        noSpecialChars: 'account.name.error.forbidden.chars',
      },
    }),
    this.formly.createInputField({
      key: 'addressLine1',
      label: 'account.default_address.street.label',
      required: true,
      errorMessages: { required: 'account.address.address1.missing.error' },
    }),
    this.formly.createInputField({
      key: 'addressLine2',
      label: 'account.default_address.street2.label',
    }),
    this.formly.createInputField({
      key: 'postalCode',
      label: 'account.default_address.postalcode.label',
      required: true,
      errorMessages: { required: 'account.address.postalcode.missing.error' },
    }),
    this.formly.createInputField({
      key: 'city',
      label: 'account.default_address.city.label',
      required: true,
      errorMessages: { required: 'account.address.city.missing.error' },
    }),
    this.formly.createSelectField({
      key: 'state',
      label: 'account.default_address.state.label',
      required: true,
      errorMessages: { required: 'account.address.state.error.default' },
    }),
  ];

  constructor(private formly: FormlyService) {}

  ngOnInit(): void {
    const countryIndex = FormlyHelper.findFieldIndex('countryCode', this.fields);
    if (countryIndex !== -1) {
      this.fields[countryIndex] = FormlyHelper.updateSelectOptionsSource(
        this.fields[countryIndex],
        this.countries?.pipe(
          map(countries => countries?.map(country => ({ value: country.countryCode, label: country.name })))
        )
      );
    }

    // const regionIndex = FormlyHelper.findFieldIndex('state', this.fields);
    // if (regionIndex !== -1) {
    //   this.fields[regionIndex] = FormlyHelper.updateSelectOptionsSource(
    //     this.fields[regionIndex],
    //     this.regions?.pipe(map(regions => regions?.map(region => ({ value: region.id, label: region.name }))))
    //   );
    // }
  }

  submitForm() {
    console.log(this.model);
  }
}
