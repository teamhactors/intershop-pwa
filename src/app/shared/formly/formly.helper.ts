import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}
