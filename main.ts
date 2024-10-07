import express, { Request, Response } from "express";
import expressSession from "express-session";
import dotenv from "dotenv";
import { userRouter } from "./routes/userRouter";
import Knex from "knex";
import { replicateAi } from "./routes/replicateAI";
import { productsRoutes } from './routes/productsRoutes';
import { productDetailsRoutes } from "./routes/productDetailsRoutes";
import { shoppingCartRouter } from "./routes/shoppingCartRoute";

dotenv.config();




const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];

export const knex = Knex(knexConfig); //knex instance
const main = express();

main.use(
  expressSession({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);
main.use(express.urlencoded({ extended: true }));
main.use(express.json());

main.use(express.static("public"));
main.use("/photos", express.static("photos"));

main.get("/", function (req: Request, res: Response) {
  res.end("Hello World");
});

main.use(userRouter);
main.use(replicateAi);
main.use(productsRoutes);
main.use(productDetailsRoutes);
main.use(shoppingCartRouter);


const PORT = 8080;

main.listen(PORT, () => {
  // console.log(`Listening at http://project.michaelyip.info`);
  console.log(`Listening at ${PORT}`);

});
