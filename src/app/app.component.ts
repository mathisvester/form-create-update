import { Component } from '@angular/core';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-root',
  template: ` <app-product></app-product> `,
  styles: [``],
  standalone: true,
  imports: [ProductComponent],
})
export class AppComponent {
  title = 'form-create-update';
}
