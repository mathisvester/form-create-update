import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NewProduct, Product } from './_models/product.model';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { initialProducts } from './_services/data';
import { ProductsStore } from './+state/products.store';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductFormComponent],
  providers: [ProductsStore],
  template: `<ng-container *ngIf="vm$ | async as vm">
    <button (click)="productsStore.patchState({ selectedProductId: null })">
      Reset
    </button>
    <app-product-list
      [products]="vm.products"
      [selectedProduct]="vm.selectedProduct"
      (select)="
        productsStore.patchState({ selectedProductId: $event })
      "></app-product-list>
    <app-product-form
      (save)="save($event.product, $event.callback)"
      [product]="vm.selectedProduct"></app-product-form>
  </ng-container>`,
  styles: [``],
})
export class ProductComponent implements OnInit {
  readonly productsStore: ProductsStore = inject(ProductsStore);

  readonly vm$: Observable<{
    products: Product[];
    selectedProduct: Product | null;
  }> = this.productsStore.vm$;

  private static isProduct(type: Product | NewProduct): type is Product {
    return (type as Product).id !== undefined;
  }

  ngOnInit() {
    this.productsStore.setState({
      products: initialProducts,
      selectedProductId: null,
    });
  }

  save(product: Product | NewProduct, callback: () => void) {
    if (ProductComponent.isProduct(product)) {
      this.productsStore.updateProduct({ product, callback });
      /*this.productService
        .updateProduct(product)
        .pipe(take(1))
        .subscribe(() => callback());*/
    } else {
      this.productsStore.createProduct({ product, callback });
      /*this.productService
        .createProduct(product)
        .pipe(take(1))
        .subscribe(() => callback());*/
    }
  }
}
