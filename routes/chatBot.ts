import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { knex } from "../main";

export const chatBot = express();

dotenv.config();

const baseUrl = process.env.BASE_URL
const apiKey = process.env.OPENAI_API_KEY

// chatBot.use(express.json());

chatBot.post("/checkProduct", checkProduct)
chatBot.get("/readMessage", readMessage)
chatBot.post("/writeMessage", writeMessage)
chatBot.post("/responseMessage", responseMessage)


async function checkProduct(req: Request, res: Response) {
    const { model, productType, color } = req.body

    try {
        const productTypeResults = await knex("category")
            .select("*")
            .where("category_name", productType)

        const reqProductTypeIds = []

        for (const reqProductType of productTypeResults) {
            reqProductTypeIds.push(reqProductType.id)
        }

        const reqModel = await knex("model")
            .select("*")
            .where("name", model)

        const reqColor = await knex("color")
            .select("*")
            .where("name", color)

        const reqProductResults = await knex("products")
            .select("*")
            .whereIn("category_id", reqProductTypeIds)

        const reqProductIds = []

        for (const reqProductResult of reqProductResults) {
            reqProductIds.push(reqProductResult.id)
        }

        const reqProducts = await knex('product_option')
            .select('*')
            .join("products", "products.id", "product_option.products_id")
            .join("product_image", "products.id", "product_image.product_id")
            .where('model_id', reqModel[0].id)
            .andWhere('color_id', reqColor[0].id)
            .whereIn('products_id', reqProductIds)

        if (reqProducts.length > 0) {
            res.json(reqProducts);
        } else {
            res.status(404).json({ error: `No product can be found.` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

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
        await knex.insert([{member_id: userId, user_message: message}]).into("chat_box")
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
        await knex.insert([{member_id: userId, response_message: message}]).into("chat_box")
        res.json({ message: "Message sent" })
    } catch {
        res.status(500).json({ message: "Failed to send message." });
    }
}