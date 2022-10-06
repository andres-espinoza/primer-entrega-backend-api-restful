import Product, { IProduct } from '../model/Product';
import Container, { FileData } from './Container';

const ProductsContainer = new Container('./src/files/products.json');

class Products {
  GetProducts(): Promise<Product[]> {
    return ProductsContainer.GetItems.then((data) => data as Product[]);
  }

  private FindIndexProduct(id: number): Promise<number> {
    return this.GetProducts().then((prods) => prods.findIndex((p) => p.id === id));
  }

  GetProductById(id: number): Promise<Product | never[]> {
    return this.GetProducts().then((prods) => {
      const product = prods.find((p) => p.id === id);
      if (product) return product;
      return [];
    });
  }

  async AddProducts(newProducts: IProduct[]): Promise<Product[]> {
    const productsInFile = await this.GetProducts();
    let id = productsInFile.length;
    const productsToAdd = newProducts.map((p) => new Product(p, ++id));
    await ProductsContainer.Save({ products: [...productsInFile, ...productsToAdd] } as FileData);
    return productsToAdd;
  }

  async UpdateProduct(productUpdate: IProduct, id: number): Promise<Product | never[]> {
    const productIndex = await this.FindIndexProduct(id);
    if (productIndex === -1) return [];
    const productsInFile = await this.GetProducts();
    const { title, price, url, description, sku, stock } = productUpdate;
    const productUpdated: Product = {
      ...productsInFile[productIndex],
      price: `$${price.toLocaleString('es-CL')}`,
      title,
      url,
      description,
      sku,
      stock,
    };
    productsInFile[productIndex] = productUpdated;
    await ProductsContainer.Save({ products: productsInFile } as FileData);
    return productUpdated;
  }

  async DeleteProductById(id: number): Promise<Product | never[]> {
    const productIndex = await this.FindIndexProduct(id);
    if (productIndex === -1) return [];
    const productsInFile = await this.GetProducts();
    const deletedProduct: Product = { ...productsInFile[productIndex] };
    const filteredProducts = productsInFile.filter((p) => p.id !== id);
    await ProductsContainer.Save({ products: filteredProducts } as FileData);
    return deletedProduct;
  }
}

const ProductsDB = new Products();

export default ProductsDB;
