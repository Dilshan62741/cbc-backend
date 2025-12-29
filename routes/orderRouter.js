import express from "express";
import { CreateOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/",CreateOrder)

export default orderRouter;