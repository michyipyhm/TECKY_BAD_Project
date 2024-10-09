import express, { Request, Response, Router } from "express";
import { knex } from "../main";

export const shoppingCartRouter = express.Router();

shoppingCartRouter.get("/shoppingcart", getAllItems); //shoppingCart
shoppingCartRouter.post("/addToCart", addToCart); // productdetails
shoppingCartRouter.post("/selectedQuantity", postQuantity); //shoppingCart
shoppingCartRouter.delete("/deleteShoppingCartItem", deleteItem); //shoppingCart
shoppingCartRouter.post("/shoppingCartSendOrder", checkout); //shoppingCart

// interface CustomRequest extends Request {
//   session: Session & Partial<SessionData> & {
//     userId: string;
//   };
// }

async function getAllItems(req: Request, res: Response) {
  const userId = req.session.userId;
  console.log("userId in ts =", userId);
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
      .join("products", "products.id", "product_option.product_id")
      .join("product_image", "products.id", "product_image.product_id")
      .join("model", "model.id", "product_option.model_id")
      .join("color", "color.id", "product_option.color_id")
      .join("category", "category.id", "products.category_id")


      .where("shopping_cart.member_id", userId);

    console.log("join all table queryResult =",queryResult)

    let data = queryResult.map((row: any) => ({
      id: row.id,
      product_id: row.product_id,
      image_path: row.image_path,
      quantity: row.quantity,
      product_price: row.product_price,
    }));

    console.log("data =", data);

    let totalPrice = data.reduce((accumulator, item) => {
      return accumulator + item.product_price * item.quantity;
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

    console.log("ts productName =", productName);
    console.log("ts userId =", userId);

    const productIdResult = await knex
      .select("id")
      .from("products")
      .where({ product_name: productName });

    console.log("productIdResult =", productIdResult);

    const productId = productIdResult[0].id;
    console.log("productId =", productId);

    //檢查product是否重覆
    const checkProductQuery = await knex
      .select("product_option_id")
      .from("shopping_cart")
      .where("member_id", userId);

    console.log("checkProductQuery =", checkProductQuery);

    for (const result of checkProductQuery) {
      console.log("result =", result);
      if (result.product_option_id === productId) {
        console.log("It is already in your shopping cart");
        res
          .status(400)
          .send({ message: "It is already in your shopping cart" });
          return;
      }
    }

    // 檢查stock
    const checkStockQuery = await knex
      .select("product_quantity")
      .from("products")
      .where("id", productId);

    console.log("checkStockQuery =", checkStockQuery);

    const currentStock = checkStockQuery[0].product_quantity;
    if (currentStock <= 0) {
      res.status(400).send({ message: "It is sold out." });
      return;
    } else {
      res.status(200).send({ message: "It is available." });
    }

    // 檢查shopping cart limit
    const checkLimitQuery = await knex
      .select("member_id")
      .from("shopping_cart")
      .where("member_id", userId);

    console.log("checkLimitQuery =", checkLimitQuery);

    const checkLimit = checkLimitQuery.length;

    if (checkLimit > 5) {
      res.status(400).send({
        message:
          "Shopping cart is full. Please check out or clear your shopping cart.",
      });
      return;
    } else {
       await knex
    .insert({
      product_option_id: productId,
      member_id: userId,
      quantity: 1,
    })
    .into("shopping_cart");
    return;
    }

    //add to cart

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Please login first" });
  }
}

async function postQuantity(req: Request, res: Response) {
  try {
    let data = req.body;
    let id = data.id;
    let quantity = data.quantity;
    console.log("Product", id, "'s quantity has been changed to", quantity);

    // 檢查stock
    const checkStockQuery = await knex
      .select("product_quantity")
      .from("products")
      .where("id", id);

    const currentStock = checkStockQuery[0].product_quantity;
    if (currentStock < quantity) {
      res.status(400).json({
        message: `Available: ${currentStock}, Requested: ${quantity}`,
      });
    }

    await knex
      .from("shopping_cart")
      .where("product_option_id", id)
      .update({ quantity: quantity });

    res.status(200).json({ message: "Quantity updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Quantity failed");
  }
}

async function deleteItem(req: Request, res: Response) {
  const data = req.body;
  const id = data.id;
  console.log("You are delected product", data);
  try {
    await knex
    .from("shopping_cart")
    .where("product_option_id", id)
    .del();
    res.status(200).json({ message: "Item deteted!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Item detete failed");
  }
}

async function checkout(req: Request, res: Response) {
  try {
    const userId = req.session.userId;

    // 檢查order
    const checkOrderQuery = await knex
      .select("*")
      .from("orders")
      .where({ state: "pending", member_id: userId });

    if (checkOrderQuery.length > 0) {
      res.status(400).send({
        message: "Please check out or cancel your unpaid order first.",
      });
    }
 
    const shoppingCartResults = await knex
      .select("*")
      .from("shopping_cart")
      .join(
        "product_option",
        "product_option.id",
        "shopping_cart.product_option_id"
      )
      .join("products", "products.id", "shopping_cart.product_option_id")
      .where("member_id", userId);


    // const shoppingCartResults = shoppingCartQuery[0];

    const totalPriceQueryResult = await knex
      .sum({ total: knex.raw("product_price * quantity") })
      .from("shopping_cart")
      .join(
        "product_option",
        "product_option.id",
        "shopping_cart.product_option_id"
      )
      .join("products", "products.id", "shopping_cart.product_option_id")
      .where("member_id", userId);

 
    const totalPrice = totalPriceQueryResult[0].total;
    const state = "Pending";

    // console.log("userId =", userId);
    // console.log("totalPrice =", totalPrice);
    // console.log("state =", state);
  
    //更新orders
    const sendOrder = await knex
      .insert({
        member_id: userId,
        total: totalPrice,
        state: state,
      })
      .from("orders")
      .returning("id");
    
      console.log(sendOrder[0].id )
      console.log("shoppingCartResults =", shoppingCartResults);

    for (const shoppingCartResult of shoppingCartResults) {
      const orderId = sendOrder[0].id;
      const productName = shoppingCartResult.product_name;
      const product_id = shoppingCartResult.product_id;
      const quantity = shoppingCartResult.quantity;
      const product_price = shoppingCartResult.product_price;
      const subtotal =
        shoppingCartResult.quantity * shoppingCartResult.product_price;

      // console.log("orderId =", orderId);
      // console.log("productName =", productName);
      // console.log("product_id =", product_id);
      // console.log("quantity =", quantity);
      // console.log("product_price =", product_price);
      // console.log("subtotal =", subtotal);


      //Check stock
      const checkStockQuery = await knex
        .select("product_quantity")
        .from("products")
        .where("id", product_id);
      
      const currentStock = checkStockQuery[0].product_quantity;

      if (currentStock < quantity) {
        res.status(400).json({ message: `'${productName}'. Available: ${currentStock}, Requested: ${quantity}` });
      }

      //扣product table內的庫存
      await knex
        .from("product")
        .where("id", product_id)
        .decrement("product_quantity", quantity);

      //更新order details
      await knex
      .from("order_details")
      .insert({
        orders_id: orderId,
        product_id: product_id,
        quantity: quantity,
        product_price: product_price,
        subtotal: subtotal,
      });
    }

    //清空shopping cart
    await knex
      .from("shopping_cart")
      .where("member_id", userId)
      .del();

    // //刪除session
    // await knex.from("shopping_cart").where("member_id", userId).del();
  
    res.status(200).json({ message: "Order submitted!" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order failed" });
    return;
  }
}

