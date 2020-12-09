import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-custom-input-field',
  templateUrl: './custom-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputFieldComponent extends FieldType {
  formControl: FormControl;

  get type() {
    return this.to.type || 'text';
  }
}
