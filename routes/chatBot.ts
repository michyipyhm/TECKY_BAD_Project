import dotenv from "dotenv";
import express from "express";
import { GptController } from "../controllers/gptController";
import { ProductService } from "../services/productService";
export const chatBot = express();
dotenv.config();

const productService = new ProductService()
const gptController = new GptController(productService)
chatBot.post("/checkProduct", gptController.checkProduct)


chatBot.post("/aiBot", gptController.aiBot)
