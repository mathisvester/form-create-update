import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { NewProduct, Product } from '../_models/product.model';
import { exhaustMap, Observable, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../_services/product.service';

export interface ProductsState {
  products: Product[];
  selectedProductId: number | null;
}

@Injectable()
export class ProductStore extends ComponentStore<ProductsState> {
  readonly products$: Observable<Product[]> = this.select(
    state => state.products
  );

  readonly selectedProductId$: Observable<number | null> = this.select(
    state => state.selectedProductId
  );

  readonly selectedProduct$: Observable<Product | null> = this.select(
    this.products$,
    this.selectedProductId$,
    (products, selectedProductId) =>
      products.find(product => product.id === selectedProductId) ?? null
  );

  readonly vm$: Observable<{
    products: Product[];
    selectedProduct: Product | null;
  }> = this.select({
    products: this.products$,
    selectedProduct: this.selectedProduct$,
  });

  readonly createProduct = this.effect(
    (
      product$: Observable<{
        product: NewProduct;
        successCallback: () => void;
        errorCallback: () => void;
      }>
    ) => {
      return product$.pipe(
        exhaustMap(({ product, successCallback, errorCallback }) =>
          this.productsService.createProduct(product).pipe(
            tapResponse(
              product => {
                successCallback();
                this.addProduct(product);
              },
              (error: HttpErrorResponse) => {
                errorCallback();
                return of(error);
              }
            )
          )
        )
      );
    }
  );

  readonly updateProduct = this.effect(
    (
      product$: Observable<{
        product: Product;
        successCallback: () => void;
        errorCallback: () => void;
      }>
    ) => {
      return product$.pipe(
        exhaustMap(({ product, successCallback, errorCallback }) =>
          this.productsService.updateProduct(product).pipe(
            tapResponse(
              product => {
                successCallback();
                this.replaceProduct(product);
              },
              (error: HttpErrorResponse) => {
                errorCallback();
                return of(error);
              }
            )
          )
        )
      );
    }
  );

  readonly addProduct = this.updater((state, product: Product) => ({
    ...state,
    products: [...state.products, product],
  }));

  readonly replaceProduct = this.updater((state, product: Product) => ({
    selectedProductId: null,
    products: state.products.map(p => (p.id === product.id ? product : p)),
  }));

  private readonly productsService: ProductService = inject(ProductService);
}
