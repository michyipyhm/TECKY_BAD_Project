import express, { Request, Response } from "express";
import Replicate from "replicate";
import dotenv from "dotenv";

export const replicateAi = express();

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


replicateAi.post("/replicateAI", async function (req: Request, res: Response) {

  try {

    const prompt = " image of " + req.body.prompt + " and a vibrant artistic graffiti background on an iphone 14 case and a plain background" || "a photo of vibrant artistic graffiti about giraffe on a iphone 15 case with plain background";
    
    // console.log("final prompt: ", prompt);

    const input = {
      prompt: prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4,
    };

    const output = await replicate.run("black-forest-labs/flux-schnell", { input });

    res.json({ 
      success: true,
      data: output,
      message: "Image generated successfully"
    });
  } catch (error) {
    console.error("Error running replicate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  console.log("res.json = ", res.json());
});


