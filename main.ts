import express , { Request, Response }from "express";
import expressSession from "express-session";
import dotenv from "dotenv";

dotenv.config();
import { userRouter } from "./routes/userRouter";
import { filter } from './routes/filterRoutes';
import { productRoutes } from "./routes/productRoutes";
import Knex from "knex";
const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);　//knex instance

const main = express();

main.use(express.urlencoded({ extended: true }));
main.use(express.json());
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

main.use(express.static("public"));

main.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

main.use(userRouter);

const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at http://project.michaelyip.info`);
});