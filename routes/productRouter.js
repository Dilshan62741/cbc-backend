import express from "express";
import { deleteProduct, getProdct, saveProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getProdct);
productRouter.post("/",saveProduct)
productRouter.delete("/:productId",deleteProduct)

export default productRouter;