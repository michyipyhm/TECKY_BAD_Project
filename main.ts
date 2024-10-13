import express, { Request, Response } from "express";
import expressSession from "express-session";
import dotenv from "dotenv";
import { authRouter } from "./routers/authRouter";
import Knex from "knex";
import { replicateAi } from "./routers/replicateAI";
import { chatRouter } from "./routers/chatRouter";
import { productsRoutes } from './routers/productsFilterRoutes';
import { productDetailsRoutes } from "./routers/productDetailsRoutes";
import { shoppingCartRouter } from "./routers/shoppingCartRoute";
import { orderRouter } from "./routers/orderRoute";
import { categoryRoutes } from "./routers/categoryRoutes";
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

main.use(authRouter);
main.use(replicateAi);
main.use(chatRouter);
main.use(categoryRoutes);
main.use(productsRoutes);
main.use(productDetailsRoutes);
// main.use(isLoggedIn, shoppingCartRouter);
main.use(orderRouter);
main.use(shoppingCartRouter);


const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
