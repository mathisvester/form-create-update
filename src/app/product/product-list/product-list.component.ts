import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../_models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngFor="let product of products"
      [class.background-grey]="selectedProduct?.id === product.id"
      (click)="select.emit(product.id)">
      {{ product.id }} {{ product.title }}
    </div>
  `,
  styles: [
    `
      .background-grey {
        background: grey;
      }
    `,
  ],
})
export class ProductListComponent {
  @Output() select = new EventEmitter<number>();
  @Input() products: Product[] = [];
  @Input() selectedProduct: Product | null = null;
}
