import express , { Request, Response }from "express";
import expressSession from "express-session";
import dotenv from "dotenv";
dotenv.config();
import { memberRouter } from "./routes/memberRouter";

import Knex from "knex";
const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);　//knex instance

const main = express();



main.use(
  expressSession({
    secret: process.env.SECRET as string,
    resave: true,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface SessionData {
    userId?: number;
    adminName: string;
  }
}

main.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

main.use(memberRouter);

const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at http://project.michaelyip.info`);
});