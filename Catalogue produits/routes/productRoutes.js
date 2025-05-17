import { Router } from "express";

const productRouter = Router();

import productController from "../controllers/productController.js";

productRouter.post("/products", productController.createProduct);
productRouter.get("/products", productController.getAllProducts);
productRouter.get("/products/:id", productController.getProductById);
productRouter.put("/products/:id", productController.updateProduct);
productRouter.delete("/products/:id", productController.deleteProduct)
productRouter.get('/products/promos', productController.getProductsWithPromos);


export default productRouter;