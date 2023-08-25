import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NewProduct, Product } from './_models/product.model';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { initialProducts } from './_services/data';
import { ProductStore } from './+state/product.store';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductFormComponent],
  providers: [ProductStore],
  template: `<ng-container *ngIf="vm$ | async as vm">
    <button (click)="productStore.patchState({ selectedProductId: null })">
      Reset selected product
    </button>
    <app-product-list
      [products]="vm.products"
      [selectedProduct]="vm.selectedProduct"
      (select)="
        productStore.patchState({ selectedProductId: $event })
      "></app-product-list>
    <app-product-form
      (save)="
        save($event.product, $event.successCallback, $event.errorCallback)
      "
      [product]="vm.selectedProduct"></app-product-form>
  </ng-container>`,
  styles: [``],
})
export class ProductComponent implements OnInit {
  readonly productStore: ProductStore = inject(ProductStore);

  readonly vm$: Observable<{
    products: Product[];
    selectedProduct: Product | null;
  }> = this.productStore.vm$;

  private static isProduct(type: Product | NewProduct): type is Product {
    return (type as Product).id !== undefined;
  }

  ngOnInit() {
    this.productStore.setState({
      products: initialProducts,
      selectedProductId: null,
    });
  }

  save(
    product: Product | NewProduct,
    successCallback: () => void,
    errorCallback: () => void
  ) {
    if (ProductComponent.isProduct(product)) {
      this.productStore.updateProduct({
        product,
        successCallback,
        errorCallback,
      });
    } else {
      this.productStore.createProduct({
        product,
        successCallback,
        errorCallback,
      });
    }
  }
}
