import express, { Request, Response } from "express";
import { knex } from "../main";
import OpenAI from "openai";
import { ChatCompletionTool } from "openai/resources";
import { ProductService } from "../services/productService";
import { JSONParser } from "formidable/parsers";


type Messages = OpenAI.Chat.Completions.ChatCompletionMessageParam[];


export class GptController {
    private apiKey = process.env.OPENAI_API_KEY
    private baseURL = process.env.BASE_URL
    private openAi = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL,
    });

    constructor(private productService: ProductService) { }

    add = (number1: number, number2: number) => {
        // console.log(number1, number2)
        return number1 + number2;
    };
    subtract = (number1: number, number2: number) => {
        return number1 - number2;
    };

    aiBot = async (req: Request, res: Response) => {
        const { question } = req.body;
        console.log(req.body)
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
                // {
                //     function: {
                //         name: "abc",
                //         description: "find out all products by model, category, color",
                //         parameters: {
                //             type: "object",
                //             properties: {
                //                 model: { type: "string" },
                //                 category: { type: "string" },
                //                 color: { type: "string" },
                //             },
                //             required: [],
                //         },
                //     },
                //     type: "function",
                // },
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

                let result: any[] = []
                if (methodName == "getProductsByModelAndCategoryAndColor") {
                    const arg: string = toolCall.function.arguments
                    const obj = JSON.parse(arg)
                    const model = obj.model ? obj.model : ""
                    const category = obj.category ? obj.category : ""
                    const color = obj.color ? obj.color : ""

                    // console.log({model, category, color})
                    result = await this.productService.checkProduct(model, category, color);
                }
                // else if (methodName == "abc") {
                //     const arg: string = toolCall.function.arguments 
                //     const obj = JSON.parse(arg)
                //     const param1 = obj.param1 ? obj.param1 : ""
                //     const param2 = obj.param2 ? obj.param2 : ""
                //     const param3 = obj.param3 ? obj.param3 : ""
                //     console.log({param1, param2, param3})
                //     result = await this.productService.xx(param1, param2, param3);

                // }

                // console.log("result: ", result);
                res.json({ result });
                return
            }

            res.status(400).json({ result: "fail" });
            return
        } catch (error) {
            console.log(error);
            res.status(400).json({ error });
            return
        }
    }


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