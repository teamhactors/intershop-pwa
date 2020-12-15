import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { pairwise, takeUntil } from 'rxjs/operators';

import { Region } from 'ish-core/models/region/region.model';
import { AddressFormConfigurationProvider } from 'ish-shared/formly-address-forms/configurations/address-form-configuration.provider';

@Component({
  selector: 'ish-formly-address-form',
  templateUrl: './formly-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.addressForm.valueChanges.pipe(takeUntil(this.destroy$), pairwise()).subscribe(([prev, current]) => {
      if (current.countryCode !== prev.countryCode) {
        const configuration = this.afcProvider.getConfiguration(current.countryCode);
        this.model = configuration.getModel(this.model);
        this.fields = configuration.getFieldConfiguration();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
