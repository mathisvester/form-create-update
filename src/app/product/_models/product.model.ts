export interface NewProduct {
  title: string;
  description: string;
}

export interface Product extends NewProduct {
  id: number;
}
