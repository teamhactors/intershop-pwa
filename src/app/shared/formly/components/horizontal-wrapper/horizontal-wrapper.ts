import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-horizontal-wrapper',
  template: `
    <div class="form-group row" [class.formly-has-error]="showError">
      <label [attr.for]="id" class="col-form-label" [ngClass]="to.labelClass" *ngIf="to.label">
        {{ to.label | translate }}
        <ng-container *ngIf="(to.required && to.hideRequiredMarker !== true) || to.forceRequiredStar">*</ng-container>
      </label>
      <div [ngClass]="to.fieldClass" [class.fieldset-margin]="to.fieldsetMargin">
        <ng-template #fieldComponent></ng-template>
        <ish-field-tooltip [tooltipInfo]="to.tooltip"> </ish-field-tooltip>
      </div>
    </div>
  `,
})
export class HorizontalWrapperComponent extends FieldWrapper {}
