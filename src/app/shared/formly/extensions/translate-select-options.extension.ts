import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

export class TranslateSelectOptionsExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to = field.templateOptions;
    if (!to || !to.options || to._selectOptionsTranslated) {
      return;
    }
    const oldOnChanges = field.hooks?.onChanges;
    field.hooks = {
      ...field.hooks,
      onChanges: fld => {
        if (oldOnChanges) {
          oldOnChanges(fld);
        }
        if (!to.opts) {
          return;
        }
        let opts;
        if (isObservable(to.options) && to.options) {
          opts = to.options.pipe(
            map((options: { value: unknown; label: string }[]) =>
              options.map(option => ({ ...option, label: this.translate.instant(option.label) }))
            )
          );
        } else if (!isObservable(to.options) && to.options && to.options.length > 0) {
          opts = to.options.map(option => ({ ...option, label: this.translate.instant(option.label) }));
        }
        fld.templateOptions.options = opts;
      },
    };
  }
}

export function registerTranslateSelectOptionsExtension(translate: TranslateService) {
  return {
    extensions: [
      {
        name: 'translate-select-options',
        extension: new TranslateSelectOptionsExtension(translate),
      },
    ],
  };
}
