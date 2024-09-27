import express , { Request, Response }from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});