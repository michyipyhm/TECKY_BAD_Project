import express, { Request, Response } from "express";
import expressSession from "express-session";
import dotenv from "dotenv";
import { userRouter } from "./routes/userRouter";
import Knex from "knex";
import { replicateAi } from "./routes/replicateAI";
import { chatRouter } from "./routes/chatRouter";
import { chatBot } from "./routes/chatBot";
import { productsRoutes } from './routes/productsFilterRoutes';
import { productDetailsRoutes } from "./routes/productDetailsRoutes";
import { shoppingCartRouter } from "./routes/shoppingCartRoute";
import { orderRouter } from "./routes/orderDetailRoute";
import { categoryRoutes } from "./routes/categoryRoutes";
import { stripeCheckout } from "./routes/StripeRoutes";
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
main.use(chatRouter);
main.use(chatBot);
main.use(categoryRoutes);
main.use(productsRoutes);
main.use(productDetailsRoutes);
main.use(orderRouter);
main.use(shoppingCartRouter);
main.use(stripeCheckout);
// main.use(isLoggedIn, shoppingCartRouter);



const PORT = 8080;

main.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
