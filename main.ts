import express , { Request, Response }from "express";
import dotenv from "dotenv";
import { Client } from "pg";
const main = express();

dotenv.config();

export const pgClient = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
});

pgClient.connect();

main.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});