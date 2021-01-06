import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export class TranslateSelectOptionsExtension implements FormlyExtension {
  constructor(private translate: TranslateService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to = field.templateOptions;
    if (!to || !to.options || to._selectOptionsTranslated) {
      return;
    }
    field.expressionProperties = {
      ...field.expressionProperties,
      'templateOptions.processedOptions': (_mdl: { [key: string]: unknown }, _: unknown, fld: FormlyFieldConfig) =>
        // tslint:disable-next-line:no-any
        (fld.templateOptions.options as Observable<any[]>).pipe(
          startWith([]),
          // tslint:disable-next-line:no-null-keyword
          map(options => (to.placeholder ? [{ value: null, label: to.placeholder }] : []).concat(options ?? [])),
          map(options => options?.map(option => ({ ...option, label: this.translate.instant(option.label) })))
        ),
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
