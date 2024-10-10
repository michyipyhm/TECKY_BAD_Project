import express, { Request, Response } from "express";
import expressSession from "express-session";
import dotenv from "dotenv";
import { userRouter } from "./routes/userRouter";
import Knex from "knex";
import { replicateAi } from "./routes/replicateAI";
import { chatBot } from "./routes/chatBot";
import { productsRoutes } from './routes/productsFilterRoutes';
import { productDetailsRoutes } from "./routes/productDetailsRoutes";
import { shoppingCartRouter } from "./routes/shoppingCartRoute";
import { orderRouter } from "./routes/orderRoute";
import { categoryRoutes } from "./routes/categoryRoutes";
// import { isLoggedIn } from "./utils/guards";

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

main.use(userRouter);
main.use(replicateAi);
main.use(chatBot);
main.use(categoryRoutes);
main.use(productsRoutes);
main.use(productDetailsRoutes);
// main.use(isLoggedIn, shoppingCartRouter);
main.use(orderRouter);


const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
