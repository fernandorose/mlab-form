import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldTypes } from '../../../module/coverage/enums/fields.enu';

export function syncFormControlsHelper(
  dynForm: FormGroup,
  visibleFields: string[],
  allFields: { name: string; type: FieldTypes }[],
  fb: FormBuilder,
) {
  visibleFields.forEach((name) => {
    if (!dynForm.get(name)) {
      const fieldConfig = allFields.find((f) => f.name === name);
      const initialValue = fieldConfig?.type === FieldTypes.SELECTOR ? null : '';

      dynForm.addControl(name, fb.control(initialValue, Validators.required));
    }
  });

  Object.keys(dynForm.controls).forEach((key) => {
    if (!visibleFields.includes(key)) {
      dynForm.removeControl(key);
    }
  });
}
