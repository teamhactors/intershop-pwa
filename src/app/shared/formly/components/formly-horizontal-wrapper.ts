import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'ish-horizontal-wrapper',
  template: `
    <div class="form-group row" [class.has-error]="showError">
      <label [attr.for]="id" class="col-5 col-form-label" *ngIf="to.label">
        {{ to.label | translate }}
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
      </label>
      <div class="col-7">
        <ng-template #fieldComponent></ng-template>
        <ish-validation-icons [field]="field" [showError]="showError"></ish-validation-icons>
        <ng-container *ngIf="showError" class="invalid-feedback d-block">
          <ish-validation-message [field]="field"></ish-validation-message>
        </ng-container>
        <div *ngIf="to.description">
          <small class="form-text text-muted ng-star-inserted"> {{ to.description }} </small>
        </div>
      </div>
    </div>
  `,
})
export class HorizontalWrapperComponent extends FieldWrapper {}
