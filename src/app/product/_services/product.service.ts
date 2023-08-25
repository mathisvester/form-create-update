import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NewProduct, Product } from '../_models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(
      `https://fakestoreapi.com/products/${product.id}`,
      product
    );
  }

  createProduct(product: NewProduct): Observable<Product> {
    return this.httpClient.post<Product>(
      'https://fakestoreapi.com/products',
      product
    );
  }
}
