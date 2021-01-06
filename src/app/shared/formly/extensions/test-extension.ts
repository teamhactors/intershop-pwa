import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

export const testExtension: FormlyExtension = {
  prePopulate(field: FormlyFieldConfig): void {
    if (field.type !== 'ish-select-field') {
      return;
    }
    field.hooks = {
      ...field.hooks,
      onChanges: fld => {
        console.log('options', fld.templateOptions.options);
      },
    };
  },
};
