import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-custom-textarea-field',
  templateUrl: './custom-textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTextareaFieldComponent extends FieldType {
  formControl: FormControl;

  defaultOptions = {
    templateOptions: {
      cols: 1,
      rows: 1,
    },
  };
}
