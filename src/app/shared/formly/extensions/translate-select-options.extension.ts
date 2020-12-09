import { FormlyExtension } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { isArray } from 'lodash-es';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

export class TranslateSelectOptionsExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field): void {
    const to = field.templateOptions;
    if (!to || !to.options || to._selectOptionsTranslated) {
      return;
    }
    to._selectOptionsTranslated = true;
    field.expressionProperties = {
      ...field.expressionProperties,
      // tslint:disable-next-line:variable-name
      'templateOptions.options': () => {
        if (isObservable(to.options) && to.options) {
          return to.options.pipe(
            map((options: { value: unknown; label: string }[]) =>
              options.map(option => ({ ...option, label: this.translate.instant(option.label) }))
            )
          );
        } else if (isArray(to.options) && to.options.length > 0) {
          to.options = to.options.map(option => ({ ...option, label: this.translate.instant(option.label) }));
        }
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
