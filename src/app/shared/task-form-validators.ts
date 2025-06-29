import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TaskInputData } from './task-form/task-input-model';

export const hasValueChanged = (
  initialTaskInput: TaskInputData | undefined
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // no initial value provided, return
    if (!initialTaskInput) {
      return null;
    }

    const { name: initialName, description: initialDescription } =
      initialTaskInput;
    // no name and description provided, return
    if (!initialName && !initialDescription) {
      return null;
    }

    const currentName = control.get('name')?.value;
    const currentDescription = control.get('description')?.value;

    const nameChanged = normalize(currentName) !== normalize(initialName || '');
    const descriptionChanged =
      normalize(currentDescription) !== normalize(initialDescription || '');

    // Check what fields exist in initial data and compare accordingly
    if (initialName && initialDescription) {
      // Both fields exist - at least one must change
      if (!nameChanged && !descriptionChanged) {
        return {
          valueUnchanged: true,
          message: 'Either name or description must be modified',
        };
      }
    } else if (initialName && !nameChanged) {
      // Only name exists and hasn't changed
      return {
        valueUnchanged: true,
        message: 'Name must be modified',
      };
    } else if (initialDescription && !descriptionChanged) {
      // Only description exists and hasn't changed
      return {
        valueUnchanged: true,
        message: 'Description must be modified',
      };
    }

    return null;
  };
};

const normalize = (str: string | undefined | null): string => {
  return (str || '').trim();
};
