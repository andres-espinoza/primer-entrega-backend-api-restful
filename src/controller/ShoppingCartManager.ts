import Product from '../model/Product';
import ShoppingCart from '../model/shoppingCart';
import Container, { FileData } from './Container';

const ShoppingCartContainer = new Container('./src/files/shoppingCarts.json');

class ShoppingCartManager {
  private GetShoppingCarts(): Promise<ShoppingCart[]> {
    return ShoppingCartContainer.GetItems.then((data) => data as ShoppingCart[]);
  }

  private FindIndexShoppingCart(id: number): Promise<number> {
    return this.GetShoppingCarts().then((carts) => carts.findIndex((c) => c.id === id));
  }

  GetProductsinCart(cartId: number): Promise<Product[]> {
    return this.GetShoppingCarts().then((carts) => {
      const cart = carts.find((c) => c.id === cartId);
      if (cart) return cart.products;
      return [];
    });
  }

  async CreateShoppingCart(): Promise<number> {
    const carts = await this.GetShoppingCarts();
    let id = carts.length > 0 ? carts[carts.length - 1].id : 0;
    const newCart = new ShoppingCart([], ++id);
    await ShoppingCartContainer.Save({ shoppingCarts: [...carts, newCart] } as FileData);
    return newCart.id;
  }

  async AddProductsInCart(cartId: number, products: Product[]): Promise<Product[]> {
    const indexCart = await this.FindIndexShoppingCart(cartId);
    if (indexCart === -1) return [];
    const carts = await this.GetShoppingCarts();
    carts[indexCart].products = [...carts[indexCart].products, ...products];
    await ShoppingCartContainer.Save({ shoppingCarts: carts } as FileData);
    return products;
  }

  async DeleteCartById(cartId: number): Promise<ShoppingCart | null> {
    const carts = await this.GetShoppingCarts();
    const cartToDelete = carts.find((c) => c.id === cartId);
    if (!cartToDelete) return null;
    const filteredCarts = carts.filter((c) => c.id !== cartId);
    await ShoppingCartContainer.Save({ shoppingCarts: filteredCarts } as FileData);
    return cartToDelete;
  }

  async DeleteProductInCart(cartId: number, productId: number): Promise<Product | null> {
    const carts = await this.GetShoppingCarts();
    const cartToEdit = carts.find((c) => c.id === cartId);
    if (!cartToEdit) return null;
    const productToDelete = cartToEdit.products.filter((p) => p.id === productId);
    cartToEdit.products = cartToEdit.products.filter((p) => p.id !== productId);
    await ShoppingCartContainer.Save({ shoppingCarts: carts } as FileData);
    return productToDelete[0];
  }
}

const ShoppingCartsDB = new ShoppingCartManager();

export default ShoppingCartsDB;
