import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, isObservable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { SelectOptionsSource } from './formly.service';

export class FormlyHelper {
  static findFieldIndex(key: string, fields: FormlyFieldConfig[]): number {
    return fields.findIndex(fld => fld.key === key);
  }

  /**
   * returns the field with the optionsSource inserted. If the placeholder parameter is set, appends a null-value placeholder option to the source.
   */
  static updateSelectOptionsSource(
    field: FormlyFieldConfig,
    optionsSource?:
      | Observable<{ value: number | string; label: string }[]>
      | { value: number | string; label: string }[],
    placeholder?: string
  ): FormlyFieldConfig {
    if (!optionsSource) {
      return field;
    }

    let options;
    if (placeholder) {
      if (isObservable(optionsSource)) {
        options = optionsSource.pipe(
          // tslint:disable-next-line:no-null-keyword
          map(subjects => [{ value: null, label: placeholder }].concat(subjects))
        );
      } else {
        // tslint:disable-next-line:no-null-keyword
        options = [{ value: null, label: placeholder }].concat(optionsSource);
      }
    } else {
      options = optionsSource;
    }
    return {
      ...field,
      templateOptions: {
        ...field.templateOptions,
        options,
      },
    };
  }

  static hasOptions(field: FormlyFieldConfig): boolean {
    if (!field.templateOptions?.options) {
      return false;
    }
    const options: SelectOptionsSource = isObservable(field.templateOptions?.options)
      ? field.templateOptions.options
      : of(field.templateOptions?.options);
    let result;

    options
      .pipe(
        map(opts => opts.filter(opt => !!opt.value)),
        take(1)
      )
      .subscribe(opts => {
        result = opts && opts.length > 0;
      });

    return result;
  }
}
