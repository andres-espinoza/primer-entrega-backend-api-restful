export interface IProduct {
  title: string;
  description: string;
  sku: string;
  url: string;
  price: number;
  stock: number;
}

class Product {
  title: string;

  description: string;

  price: string;

  url: string;

  stock: number;

  sku: string;

  readonly id: number;

  readonly timestamp: number;

  constructor(product: IProduct, id: number) {
    this.title = product.title;
    this.description = product.description;
    this.price = `$${product.price.toLocaleString('es-CL')}`;
    this.url = product.url;
    this.sku = product.sku;
    this.stock = product.stock;
    this.timestamp = Date.now();
    this.id = id;
  }
}

export default Product;
