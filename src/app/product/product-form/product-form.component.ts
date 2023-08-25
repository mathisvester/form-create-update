import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewProduct, Product } from '../_models/product.model';

export interface ProductForm {
  title: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <input type="text" formControlName="title" placeholder="Title" />
      <input
        type="text"
        formControlName="description"
        placeholder="Description" />
      <button type="submit" [disabled]="!form.valid" (click)="submit()">
        Save
      </button>
    </form>
  `,
  styles: [``],
})
export class ProductFormComponent {
  @Input() set product(product: Product | null) {
    this._product = product;

    if (this._product) {
      this.form.setValue({
        title: this._product.title,
        description: this._product.description,
      });
    }
  }

  get product(): Product | null {
    return this._product;
  }

  @Output() save = new EventEmitter<{
    product: Product | NewProduct;
    successCallback: () => void;
    errorCallback: () => void;
  }>();

  readonly form: FormGroup<ProductForm>;

  private _product: Product | null = null;

  private fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  submit() {
    const product: Product | NewProduct = {
      ...(this.product?.id && { id: this.product.id }),
      title: this.form.controls.title.value,
      description: this.form.controls.description.value,
    };

    this.form.disable();

    this.save.emit({
      product,
      successCallback: () => {
        this.form.enable();
        this.form.reset();
      },
      errorCallback: () => this.form.enable(),
    });
  }
}
