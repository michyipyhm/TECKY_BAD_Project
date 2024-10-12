import express, { Request, Response, Router } from "express";
import { knex } from "../main";

export const orderRouter = express.Router();

orderRouter.get("/checkOrder", checkOrder); //orderdetail.js
orderRouter.post("/orderCancel", cancelOrder); //orderdetail.js
orderRouter.get("/orderDetail", getOrderDetail);

//顯示訂單
async function checkOrder(req: Request, res: Response) {
  //purchase histroy
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json();
    return;
  }
  try {
    const orderResult = await knex
      .select("*")
      .from("order_details")
      .join("orders", "orders.id", "order_details.order_id")
      .join("products", "products.id", "order_details.product_id")
      .join("product_image", "products.id", "product_image.product_id")
      .where("member_id", userId)
      .where("state", "Pending");

    console.log("orderResult", orderResult);
    res.status(200).json({ orderResult });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching order");
  }
}

// 取消order
async function cancelOrder(req: Request, res: Response) {
  try {
    const products = await knex("order_details")
      .select("*")
      .join("product", "product.id", "order_details.product_id")
      .where("orders_id", req.body.orderId);

    for (const product of products) {
      const product_id = product.product_id;
      const quantity = product.quantity;
      await knex("product")
        .where("id", product_id)
        .update({
          product_quantity: knex.raw("product_quantity + ?", [quantity]),
        });
    }

    // await pgClient.query(
    //     `DELETE FROM order_details WHERE order_details.orders_id =$1`, [req.body.orderId])

    // await pgClient.query(
    //     `DELETE FROM orders WHERE id =$1`, [req.body.orderId])

    // Update the order state to 'Canceled'
    await knex("orders")
      .where("id", req.body.orderId)
      .update({ state: "Canceled" });

    res.status(200).json({ message: "Order canceled!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something go wrong" });
  }
}

//訂單明細
async function getOrderDetail(req: Request, res: Response) {
  //shopping cart next page
  try {
    const userId = req.session.userId;
    const orderNum = req.query.orderNum;

    const currectUserIdResult = await knex("orders")
      .select("member_id")
      .where("id", orderNum);

    const currectUserId = currectUserIdResult[0];
    if (userId != currectUserId.member_id) {
      res.status(401).json({ message: "Fail to load order." });
      return;
    }

    const orderDetailsResult = await knex("order_details")
      .select("*")
      .join("product", "product.id", "order_details.product_id")
      .join("product_image", "product_image.product_id", "product.id")
      .where("order_details.orders_id", orderNum);

    const orderStatusResult = await knex("orders")
      .select("state")
      .where("id", orderNum);

    const totalPriceQResult = await knex("orders")
      .select("total")
      .where("id", orderNum);

    const orderStatus = orderStatusResult[0];
    const data = orderDetailsResult;
    const totalPrice = totalPriceQResult[0];

    res.status(200).json({ data, totalPrice, orderStatus });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "This is not your order." });
  }
}
