import express, { Request, Response } from "express";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources";
import { GptService } from "../services/gptService";
import { knex } from "../main";


type Messages = OpenAI.Chat.Completions.ChatCompletionMessageParam[];


export class GptController {
    private apiKey = process.env.OPENAI_API_KEY
    private baseURL = process.env.BASE_URL
    private openAi = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL,
    });

    constructor(private productService: GptService) { }

    add = (number1: number, number2: number) => {
        console.log(number1, number2)
        return number1 + number2;
    };
    subtract = (number1: number, number2: number) => {
        return number1 - number2;
    };

    aiBot = async (req: Request, res: Response) => {
        const userId = req.session.userId
        const { question } = req.body;
        await knex('chat_box').insert({
            member_id: userId,
            response_message: "",
            user_message: question
        })
        console.log(req.body);
        try {
            const messageArr: Messages = [
                {
                    role: "user",
                    content: question,
                },
            ];

            const tools: Array<ChatCompletionTool> = [
                {
                    function: {
                        name: "getProductsByModelAndCategoryAndColor",
                        description: "find out all products by model, category, color",
                        parameters: {
                            type: "object",
                            properties: {
                                model: { type: "string" },
                                category: { type: "string" },
                                color: { type: "string" },
                            },
                            required: [],
                        },
                    },
                    type: "function",
                },
            ];

            const completion = await this.openAi.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messageArr,
                tools,
            });

            const resultMessage = completion.choices[0].message;
            if (resultMessage.tool_calls && resultMessage.tool_calls.length > 0) {
                const toolCall = resultMessage.tool_calls[0];
                const methodName = toolCall.function.name;
                console.log(methodName);

                let result: any[] = [];
                if (methodName === "getProductsByModelAndCategoryAndColor") {
                    const arg: string = toolCall.function.arguments;
                    const obj = JSON.parse(arg);
                    const model = obj.model || "";
                    const category = obj.category || "";
                    const color = obj.color || "";

                    result = await this.productService.checkProduct(model, category, color);
                }

                if (!question || typeof question !== "string" || question.trim().length === 0) {
                    res.status(400).json({ message: "Message cannot be empty." });
                    return;
                }

                const randomResults = result.sort(() => 0.5 - Math.random()).slice(0, 3);

                let humanizedResponse = "";
                if (randomResults.length > 0) {
                    humanizedResponse = `I found the following products that match your criteria:\n\n`;
                    randomResults.forEach((product, index) => {
                        humanizedResponse += `${index + 1}. Product Name: ${product.product_name}\n`;
                        humanizedResponse += `   Model: ${product.model_name}\n`;
                        humanizedResponse += `   Color: ${product.color_name !== "null" ? product.color_name : "No specific color"}\n`;
                        humanizedResponse += `   Subcategory: ${product.sub_category_name}\n`;
                        humanizedResponse += `   Category: ${product.category_name}\n\n`;
                    });
                } else {
                    humanizedResponse = "Sorry, I couldn't find any products matching your criteria. You may want to adjust your search conditions.";
                }
                
                humanizedResponse = humanizedResponse.replace(/\n/g, "<br>");

                await knex('chat_box').insert({
                    member_id: userId,
                    response_message: humanizedResponse,
                    user_message: ""
                });

                res.json({ message: humanizedResponse });
                return;
            }

            res.status(400).json({ result: "fail" });
            return;
        } catch (error) {
            console.log(error);
            res.status(400).json({ error });
            return;
        }
    };

    checkProduct = async (req: Request, res: Response) => {
        const { model, category, color } = req.body
        try {
            const reqProducts = await this.productService.checkProduct(model, category, color)
            if (reqProducts.length > 0) {
                res.json(reqProducts);
            } else {
                res.status(404).json({ error: `No product can be found.` });
            }
            // res.json({reqModel, reqColor, productIds, categoryResults, productResults});
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}