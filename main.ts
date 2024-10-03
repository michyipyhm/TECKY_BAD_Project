import express , { Request, Response }from "express";
import expressSession from "express-session";
import dotenv from "dotenv";
import { memberRouter } from "./routes/memberRouter";
import { replicateAi } from "./routes/replicateAI";
import Knex from "knex";

dotenv.config();

const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);　//knex instance
const main = express();

declare module "express-session" {
  interface SessionData {
    userId?: number;
    adminName: string;
  }
}

main.use(
  expressSession({
    secret: process.env.SECRET as string,
    resave: true,
    saveUninitialized: true,
  })
);

main.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

main.use(memberRouter);
main.use(replicateAi);

const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at http://project.michaelyip.info`);
});