import express , { Request, Response }from "express";
import dotenv from "dotenv";

const main = express();

dotenv.config();

main.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at http://project.michaelyip.info`);
});