import { ChangeDetectionStrategy, Component, NgZone, ViewChild } from '@angular/core';
import { FormControl, SelectControlValueAccessor } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ish-custom-select-field',
  templateUrl: './custom-select-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectFieldComponent extends FieldType {
  formControl: FormControl;
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1, o2) {
        return o1 === o2;
      },
    },
  };

  @ViewChild(SelectControlValueAccessor) set selectAccessor(s) {
    if (!s) {
      return;
    }

    const writeValue = s.writeValue.bind(s);
    if (s._getOptionId(s.value) === null) {
      writeValue(s.value);
    }

    s.writeValue = value => {
      const id = s._idCounter;
      writeValue(value);
      if (value === null) {
        this.ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            if (
              id !== s._idCounter &&
              s._getOptionId(value) === null &&
              s._elementRef.nativeElement.selectedIndex !== -1
            ) {
              writeValue(value);
            }
          });
      }
    };
  }

  constructor(private ngZone: NgZone) {
    super();
  }
}
