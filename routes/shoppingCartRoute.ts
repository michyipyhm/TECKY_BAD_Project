import express, { Request, Response, Router } from "express";
import { knex } from "../main";

export const shoppingCartRouter = express.Router();

shoppingCartRouter.get("/shoppingcart", getAllItems);
shoppingCartRouter.post("/addToCart", addToCart);


async function getAllItems(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json();
    console.log("session id error");
    return;
  }

  try {
    let queryResult = await knex
      .select("*")
      .from("shopping_cart")
      .join(
        "product_option",
        "product_option.id",
        "shopping_cart.product_option_id"
      )
      .join("products", "products.id", "product_option.products_id")
      .join("product_image", "products.id", "product_image.product_id")
      .join("model", "model.id", "product_option.model_id")
      .join("color", "color.id", "product_option.color_id")
      .join("category", "category.id", "products.category_id")
      .where("shopping_cart.member_id", userId);

    // console.log("queryResult =",queryResult)

    let data = queryResult.map((row: any) => ({
      id: row.id,
      product_id: row.product_id,
      image_path: row.image_path,
      quantity: row.quantity,
      product_price: row.product_price,
    }));

    console.log("data =", data);

    let totalPrice = data.reduce((accumulator, item) => {
      return accumulator + (item.product_price * item.quantity);
    }, 0);

    // console.log("totalPrice =", totalPrice);

    res.status(200).json({ data, totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching shopping cart");
  }
}

async function addToCart(req: Request, res: Response) {
  try {
    const userId = req.session.userId;
    const productName = req.body.name;

    console.log("productName =", productName);
//     // const productIdResult = await pgClient.query(
//     //   `SELECT id FROM product WHERE product_name = $1`,
//     //   [productName]
//     // );

//     // const productId = productIdResult.rows[0].id;

//     // //檢查product是否重覆
//     // const checkProductQuery = await pgClient.query(
//     //   `SELECT product_id FROM shopping_cart WHERE member_id = $1`,
//     //   [userId]
//     // );
//     // const checkProduct = checkProductQuery.rows;
//     // for (const result of checkProduct) {
//     //   if (result.product_id === productId) {
//     //     return res
//     //       .status(400)
//     //       .send({ message: "It is already in your shopping cart" });
//     //   }
//     // }
//     // // 檢查stock
//     // const checkStockQuery = await pgClient.query(
//     //   `SELECT product_quantity FROM product WHERE id = $1`,
//     //   [productId]
//     // );
//     // const currentStock = checkStockQuery.rows[0].product_quantity;
//     // if (currentStock <= 0) {
//     //   return res.status(400).send({ message: "It is sold out." });
//     // }
//     // // 檢查shopping cart limit
//     // const checkLimitQuery = await pgClient.query(
//     //   `SELECT member_id FROM shopping_cart WHERE member_id = $1`,
//     //   [userId]
//     // );
//     // const checkLimit = checkLimitQuery.rows.length;
//     // if (checkLimit > 3) {
//     //   return res.status(400).send({
//     //     message:
//     //       "Shopping cart is full. Please check out or clear your shopping cart.",
//     //   });
//     // }
//     // // add to cart
//     // await pgClient.query(
//     //   `INSERT INTO shopping_cart (product_id, member_id, quantity) VALUES ($1, $2, $3)`,
//     //   [productId, userId, 1]
//     // );

    // return res.status(200).json({ message: "Added to shopping Cart!" });
    return
  } catch (err) {
    console.error(err);
    return
    // return res.status(500).send({ message: "Please login first" });
  }
}