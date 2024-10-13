import express, { Request, Response } from "express";
import Replicate from "replicate";
import dotenv from "dotenv";
import { knex } from "../main";
import { Knex } from "knex";
import axios from "axios";
import fs from "fs-extra";
import path from "path";

export const replicateAi = express();

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function getNextProductId(knex: Knex): Promise<number> {
  const result = await knex("products").max("id as maxId").first();

  const latestId = result?.maxId || 0;
  return latestId + 1;
}

async function getNextProductOptionId(knex: Knex): Promise<number> {
  const result = await knex("product_option").max("id as maxId").first();

  const latestId = result?.maxId || 0;
  return latestId + 1;
}

async function getNextProductImageId(knex: Knex): Promise<number> {
  const result = await knex("product_image").max("id as maxId").first();

  const latestId = result?.maxId || 0;
  return latestId + 1;
}

async function downloadImage(url: string, filename: string): Promise<string> {
  const projectRoot = path.resolve(__dirname, '..');
  const imagePath = path.join(projectRoot, "public", "uploads", filename);
  
  await fs.ensureDir(path.dirname(imagePath));
  
  const writer = fs.createWriteStream(imagePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(imagePath));
    writer.on("error", reject);
  });
}

replicateAi.post("/replicateAI", async function (req: Request, res: Response) {
  try {

    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({ message: "Please login first" });
      return;
    }

    const { prompt, phoneModel } = req.body;
    const product_Id = await getNextProductId(knex);
    const productOptionId = await getNextProductOptionId(knex);
    const productImageId = await getNextProductImageId(knex);

    const finalPrompt =
      `a ${phoneModel} case with image of ${prompt} and vibrant artistic graffiti fit in the case` ||
      "a photo of vibrant artistic graffiti about giraffe on a iphone 15 case with plain background";

    const product_Name = `AI generated Image of ${prompt} ${phoneModel} case #${product_Id}`;

    const input = {
      prompt: finalPrompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 100,
      num_inference_steps: 4,
    };

    const output: string[] = await (replicate.run(
      "black-forest-labs/flux-schnell",
      { input }
    ) as Promise<string[]>);

    const imageUrl: string = output[0];
    console.log("imageUrl = ", imageUrl);

    const filename = `product_${product_Id}.webp`;
    
    await downloadImage(imageUrl, filename);

    console.log
    await knex("products").select("*").insert({
      id: product_Id,
      sub_category_id: 1,
      custom_made: true,
      product_name: product_Name,
      product_price: 200,
    });

    await knex("product_option").select("*").insert({
      id: productOptionId,
      model_id: 5,
      color_id: 9,
      products_id: product_Id,
      product_quantity: 1,
    });

    await knex("product_image")
      .select("*")
      .insert({
        id: productImageId,
        product_id: product_Id,
        image_path: `/uploads/${filename}`,
      });

    res.json({
      success: true,
      data: filename,
      productId: product_Id,
      productOptionId: productOptionId,
      productName: product_Name,
      message: "Image generated successfully",
    });
  } catch (error) {
    console.error("Error running replicate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
