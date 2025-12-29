import express from "express";
import { createUser, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/createUser",createUser)
userRouter.post("/loginUser",loginUser)

export default userRouter;