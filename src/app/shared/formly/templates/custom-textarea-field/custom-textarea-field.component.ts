import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-custom-textarea-field',
  templateUrl: './custom-textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTextareaFieldComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      cols: 1,
      rows: 1,
    },
  };
}
