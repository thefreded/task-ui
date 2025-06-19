import { afterNextRender, Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskInputData } from './task-input-model';
import { hasValueChanged } from '../task-form-validators';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  readonly inputValues = input<TaskInputData>();
  readonly save = output<TaskInputData>();

  constructor() {
    afterNextRender({
      write: () => {
        const data = this.inputValues();

        // Update form validators
        this.form.setValidators([
          Validators.required,
          Validators.minLength(6),
          hasValueChanged(data),
        ]);

        // Update form values
        this.form.setValue({
          name: data?.name || '',
          description: data?.description || '',
        });
      },
    });
  }

  protected form = new FormGroup({
    name: new FormControl('', {
      validators: [],
    }),
    description: new FormControl('', {
      validators: [],
    }),
  });

  get isInValidInputs() {
    return this.form?.touched && this.form?.dirty && this.form.invalid;
  }

  get errors() {
    return this.form?.errors?.['message'];
  }

  protected onSubmit() {
    if (this.form.valid) {
      const { name, description } = this.form.value;
      this.save.emit({ name, description });
      this.form.reset();
    }
  }
}
