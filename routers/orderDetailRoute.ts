import express, { Request, Response, Router } from "express";
import { knex } from "../main";

export const orderRouter = express.Router();

orderRouter.get("/checkOrder", checkOrder); //orderdetail.js
orderRouter.post("/orderCancel", cancelOrder); //orderdetail.js
orderRouter.get("/orderHistory", getOrderHistory); //orderHistory.js

//訂單明細
async function checkOrder(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json();
    return;
  }
  try {
    const orderResult = await knex.raw(
      `with images as (
        select product_id, json_agg(product_image.id) as product_image_ids, json_agg(product_image.image_path) as product_images from product_image group by product_id
    )
    SELECT *
    FROM order_details
    JOIN orders ON orders.id = order_details.order_id
    JOIN products ON products.id = order_details.product_id
    join images on products.id = images.product_id
    WHERE orders.member_id = ?
      AND orders.state = 'Pending';`,
      [userId]
    );

    let fetchOrderDetail = orderResult.rows;
    console.log("fetchOrderDetail", fetchOrderDetail);
    res.status(200).json({ fetchOrderDetail });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching order");
  }
}

// 取消order
async function cancelOrder(req: Request, res: Response) {
  try {
    const orderIdArray  = req.body.orderIds;
    const userId = req.session.userId;

    for (let i = 0; i < orderIdArray.length; i++) {
      const products = await knex("order_details")
        .select("*")
        .join("products", "products.id", "order_details.product_id")
        .where("order_id", orderIdArray[i]);

      for (const product of products) {
        console.log("product", product);
        const product_id = product.product_id;
        const quantity = product.quantity;
        console.log("product_id", product_id);
        console.log("quantity", quantity);

        await knex("product_option")
          .where("id", product_id)
          .update({
            product_quantity: knex.raw("product_quantity + ?", [quantity]),
          });
      }

      // Update the order state to 'Canceled'
      await knex("orders")
        .where("id", orderIdArray[i])
        .update({ state: "Cancelled" });

    }

     // 清空shopping cart
     await knex
     .from("shopping_cart")
     .where("member_id", userId)
     .del();

    res.status(200).json({ message: "Order canceled!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something go wrong" });
  }
};

//orderHistory
async function getOrderHistory(req: Request, res: Response) {
  try {
    
    const userId = req.session.userId;



    const currectUserIdResult = await knex("orders")
      .select("*")
      .where("member_id", userId);

    
    const currectUserId = currectUserIdResult[0];

    if (userId != currectUserId.member_id) {
      res.status(401).json({ message: "Fail to load order." });
      return;
    }

    // const orderHistory = await knex.raw(
    //   `with images as (
    //     select product_id, json_agg(product_image.id) as product_image_ids, json_agg(product_image.image_path) as product_images from product_image group by product_id
    // )
    // SELECT *
    // FROM order_details
    // JOIN orders ON orders.id = order_details.order_id
    // JOIN products ON products.id = order_details.product_id
    // join images on products.id = images.product_id
    // WHERE orders.member_id = ?`,
    //   [userId]
    // );

    const orderHistory = await knex 
    .select ("*")
    .from ("orders")
    .where ("member_id", userId);

    let orderHistoryResult = orderHistory;

    res.status(200).json({ orderHistoryResult});
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "This is not your order." });
  }
}
