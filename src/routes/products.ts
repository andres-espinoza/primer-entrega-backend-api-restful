import { Router } from 'express';
import ProductsClass from '../controller/Products';
import profileChecker from '../middlewares/profileChecker';
import { IProduct } from '../model/Product';

const route = Router();

route
  .get('/', async (_req, res) => {
    try {
      const products = await ProductsClass.GetProducts();
      res.status(200).send(products);
    } catch (error: any) {
      res.sendStatus(500);
    }
  })
  .get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductsClass.GetProductById(Number(id));
      res.status(200).send(product);
    } catch (error: any) {
      res.sendStatus(500);
    }
  })
  .post('/', profileChecker(), async (req, res) => {
    try {
      const { products: newProducts }: { products: IProduct[] } = req.body;
      newProducts.forEach((p) => {
        p.price = Number(p.price);
        p.stock = Number(p.stock);
      });
      const addedProduct = await ProductsClass.AddProducts(newProducts);
      res.status(200).send(addedProduct);
    } catch (error: any) {
      res.sendStatus(500);
    }
  })
  .put('/:id', profileChecker(), async (req, res) => {
    try {
      const { title, price, url, description, sku, stock }: IProduct = req.body;
      const { id } = req.params;
      const updatedProduct = await ProductsClass.UpdateProduct(
        {
          title,
          price: Number(price),
          url,
          description,
          sku,
          stock: Number(stock),
        },
        Number(id)
      );
      res.status(200).send(updatedProduct);
    } catch (error: any) {
      res.sendStatus(500);
    }
  })
  .delete('/:id', profileChecker(),  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductsClass.DeleteProductById(Number(id));
      console.log(deletedProduct);
      res.status(200).send(deletedProduct);
    } catch (error: any) {
      res.sendStatus(500);
    }
  });

export default route;
