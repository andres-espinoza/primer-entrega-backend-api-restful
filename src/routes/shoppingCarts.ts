import { Router } from 'express';
import ProductsDB from '../controller/Products';
import ShoppingCartsDB from '../controller/ShoppingCartManager';
import { IProduct } from '../model/Product';

const route = Router();

route
  .post('/', async (_req, res) => {
    try {
      const newCartId = await ShoppingCartsDB.CreateShoppingCart();
      res.status(200).send({ cartId: newCartId });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  })
  .post('/:id/products', async (req, res) => {
    try {
      const { id } = req.params;
      const { products }: { products: IProduct[] } = req.body;
      const prods = await ProductsDB.AddProducts(products);
      const addedProducts = await ShoppingCartsDB.AddProductsInCart(Number(id), prods);
      res.status(200).send({ products: addedProducts });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  })
  .get('/:id/products', async (req, res) => {
    try {
      const { id } = req.params;
      const productsInCart = await ShoppingCartsDB.GetProductsinCart(Number(id));
      res.status(200).send(productsInCart);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCart = await ShoppingCartsDB.DeleteCartById(Number(id));
      res.status(200).send(deletedCart);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  })
  .delete('/:id/products/:prodId', async (req, res) => {
    try {
      const { id: cartId } = req.params;
      const { prodId } = req.params;
      const deletedProduct = await ShoppingCartsDB.DeleteProductInCart(
        Number(cartId),
        Number(prodId)
      );
      res.status(200).send(deletedProduct);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

export default route;
