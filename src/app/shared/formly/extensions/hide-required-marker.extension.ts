import { FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

export const hideRequiredMarkerExtension: FormlyExtension = {
  prePopulate(field): void {
    field.expressionProperties = {
      ...field.expressionProperties,
      // tslint:disable-next-line:variable-name
      'templateOptions.hideRequiredMarker': (_model, _formState, fld) =>
        (fld.parent.fieldGroup as FormlyFieldConfig[])?.every(f => f.templateOptions.required)
          ? true
          : !fld.templateOptions.required,
    };
  },
};
