import Product from './Product';

class ShoppingCart {
  readonly id: number;

  readonly timestamp: number;

  products: Product[];

  constructor(cart: Product[], id: number) {
    this.timestamp = Date.now();
    this.id = id;
    this.products = cart;
  }
}

export default ShoppingCart;
