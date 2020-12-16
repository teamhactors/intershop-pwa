import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';

import { Region } from 'ish-core/models/region/region.model';
import { AddressFormConfigurationProvider } from 'ish-shared/formly-address-forms/configurations/address-form-configuration.provider';
import { markAsPristineRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-formly-address-form',
  templateUrl: './formly-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyAddressFormComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;

  /** WIP */
  @Input() countryCode: string;
  @Input() regions: Observable<Region[]>;
  @Input() titles: string[];

  private destroy$ = new Subject();

  addressForm = new FormGroup({});
  model = this.afcProvider.getConfiguration().getModel();
  fields: FormlyFieldConfig[] = this.afcProvider.getConfiguration().getFieldConfiguration();

  constructor(private afcProvider: AddressFormConfigurationProvider) {}

  ngOnInit(): void {
    this.parentForm?.setControl('address', this.addressForm);
    this.addressForm.setParent(this.parentForm);
    this.addressForm.valueChanges.pipe(pairwise(), takeUntil(this.destroy$)).subscribe(([prev, current]) => {
      if (current.countryCode !== prev.countryCode) {
        const configuration = this.afcProvider.getConfiguration(current.countryCode);
        this.model = configuration.getModel(this.model);
        this.fields = configuration.getFieldConfiguration();

        const countryCodeControl = this.addressForm.get('countryCode');
        markAsPristineRecursive(this.addressForm);
        countryCodeControl.markAsDirty();
        countryCodeControl.updateValueAndValidity();

        this.parentForm.setControl('address', this.addressForm);
        this.parentForm.setControl('countryCodeSwitch', countryCodeControl);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
