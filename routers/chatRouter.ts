import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { knex } from "../main";
export const chatRouter = express();

import { GptController } from "../controllers/gptController";
import { ProductService } from "../services/gptService";

const productService = new ProductService()
const gptController = new GptController(productService)

chatRouter.post("/checkProduct", gptController.checkProduct)
chatRouter.post("/aiBot", gptController.aiBot)

dotenv.config();

chatRouter.get("/readMessage", readMessage)
chatRouter.post("/writeMessage", writeMessage)
chatRouter.post("/responseMessage", responseMessage)
chatRouter.post("/createNewChat", createNewChat)

async function readMessage(req: Request, res: Response) {
    const userId = req.session.userId;
    if (!userId) {
        res.status(401).json({ message: "Please login first." });
        return;
    }
    const userMessage = await knex.select("*").from("chat_box").where("member_id", userId);
    if (userMessage.length === 0) {
        res.status(401).json({ message: "No Message Record can be found." });
        return
    }
    res.json({ userMessage });
}

async function writeMessage(req: Request, res: Response) {
    const userId = req.session.userId;
    const data = req.body;
    const message = data.message

    if (!userId) {
        res.status(401).json({ message: "Please login first." });
        return;
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ message: "Message cannot be empty." });
        return;
    }
    try {
        await knex.insert([{ member_id: userId, user_message: message, response_message: "" }]).into("chat_box")
        res.json({ message: "Message sent" })
    } catch {
        res.status(500).json({ message: "Failed to send message." });
    }
}

async function responseMessage(req: Request, res: Response) {
    const data = req.body;
    const userId = data.userId
    const message = data.message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ message: "Message cannot be empty." });
        return;
    }
    try {
        await knex.insert([{ member_id: userId, user_message: "", response_message: message }]).into("chat_box")
        res.json({ message: "Message sent" })
    } catch {
        res.status(500).json({ message: "Failed to send message." });
    }
}

async function createNewChat(req: Request, res: Response) {
    const userId = req.session.userId;
    if (!userId) {
        res.status(401).json({ message: "Please login first." });
        return;
    }
    try {
        await knex("chat_box").where("member_id", userId).del();
        res.json({ message: "New chat created." })
    } catch {
        res.status(500).json({ message: "Failed to create new Chat" });
    }
}