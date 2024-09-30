import express , { Request, Response }from "express";
import expressSession from "express-session";
import dotenv from "dotenv";
import { memberRouter } from "./routes/memberRouter";

const main = express();

dotenv.config();

main.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

main.use(memberRouter);

const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});