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
        <ish-validation-icons [field]="field" [showError]="showError"></ish-validation-icons>
        <ish-field-tooltip [tooltipInfo]="to.tooltip"> </ish-field-tooltip>
        <ng-container *ngIf="showError" class="invalid-feedback d-block">
          <ish-validation-message [field]="field" class="validation-message"></ish-validation-message>
        </ng-container>
        <div *ngIf="to.description">
          <small class="form-text text-muted ng-star-inserted"> {{ to.description }} </small>
        </div>
      </div>
    </div>
  `,
})
export class HorizontalWrapperComponent extends FieldWrapper {}
