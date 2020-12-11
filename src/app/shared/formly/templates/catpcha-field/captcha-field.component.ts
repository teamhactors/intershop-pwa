import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-captcha-field',
  templateUrl: './captcha-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaFieldComponent extends FieldType {}
