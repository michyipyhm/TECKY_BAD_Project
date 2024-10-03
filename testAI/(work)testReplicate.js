import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });

// console.log("process.env.REPLICATE_API_TOKEN is ",process.env.REPLICATE_API_TOKEN);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const input = {
    prompt: "a photo of vibrant artistic graffiti about cat on a iphone 15 case with plain background",
    go_fast: true,
    megapixels: "1",
    num_outputs: 1,
    aspect_ratio: "1:1",
    output_format: "webp",
    output_quality: 80,
    num_inference_steps: 4
  };
  
  const output = await replicate.run("black-forest-labs/flux-schnell", { input });
  console.log("output is ",output);