import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-custom-catpcha-field',
  templateUrl: './custom-catpcha-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCatpchaFieldComponent extends FieldType {}
