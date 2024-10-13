import express, { Request, Response, Router } from "express";
import { Session } from 'express-session';
import { knex } from "../main";
// import { isLoggedIn } from "../utils/guards";

export const shoppingCartRouter = express.Router();

shoppingCartRouter.get("/shoppingcart", getAllItems); //shoppingCart
shoppingCartRouter.post("/addToCart", addToCart as express.RequestHandler); // productdetails
shoppingCartRouter.post("/selectedQuantity", postQuantity); //shoppingCart
shoppingCartRouter.delete("/deleteShoppingCartItem", deleteItem); //shoppingCart
shoppingCartRouter.post("/shoppingCartSendOrder", checkout); //shoppingCart

interface CustomRequest extends Request {
  session: Session & {
    userId?: string;
  };
}

async function getAllItems(req: Request, res: Response) {
  const userId = req.session.userId;
 
  if (!userId) {
    res.status(401).json();
    return;
  }

  try {
    let queryResult = await knex.raw(
      `with carts as (
          SELECT shopping_cart.*, 
          product_option.id as product_option_id,
          product_option.model_id as model_id,
          model.name as model_name,
          product_option.product_quantity as product_quantity,

          product_option.color_id as color_id,
          color.name as color_name,

          product_option.products_id as product_id,
          products.product_name as product_name,

          products.sub_category_id as sub_category_id,
          sub_category.category_name as sub_category_name,

          products.product_price as product_price,
          products.custom_made as custom_made

          FROM shopping_cart
          JOIN product_option ON product_option.id = shopping_cart.product_option_id
          JOIN products ON products.id = product_option.products_id
          JOIN model ON model.id = product_option.model_id
          JOIN color ON color.id = product_option.color_id
          JOIN sub_category ON sub_category.id = products.sub_category_id
          JOIN category ON category.id = sub_category.category_id
          WHERE shopping_cart.member_id = ?
      ),
      images as (
          select product_id, json_agg(product_image.id) as product_image_ids, json_agg(product_image.image_path) as product_images from product_image group by product_id
      )
      select * from carts left join images on carts.product_id = images.product_id;`, [userId]
    )

    const result = queryResult.rows;

    console.log("join all table queryResult =",result)

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching shopping cart");
  }
}

async function addToCart(req: CustomRequest, res: Response): Promise<void> {
  try {
    const userId = req.session.userId;
    const productName = req.body.name;

    if (!userId) {
      res.status(401).json({ message: "Please login first" });
      return;
    }

    const productIdResult = await knex
      .select("id")
      .from("products")
      .where({ product_name: productName });

    if (productIdResult.length === 0) {
       res.status(404).json({ message: "Product not found" });
       return;
    }

    const productId = productIdResult[0].id;

    // Check if product is already in cart
    const checkProductQuery = await knex
      .select("product_option_id")
      .from("shopping_cart")
      .where({ member_id: userId, product_option_id: productId });

      console.log("checkProductQuery =", checkProductQuery)
      
    if (checkProductQuery.length > 0) {
       res.status(400).json({ message: "It is already in your shopping cart" });
       return;
    }

    // Check stock
    const checkStockQuery = await knex
      .select("product_quantity")
      .from("product_option")
      .where("id", productId);

    if (checkStockQuery.length === 0 || checkStockQuery[0].product_quantity <= 0) {
       res.status(400).json({ message: "It is sold out." });
       return;
    }

    // Check shopping cart limit
    const checkLimitQuery = await knex
      .select("member_id")
      .from("shopping_cart")
      .where("member_id", userId);

    if (checkLimitQuery.length >= 5) {
       res.status(400).json({
        message: "Shopping cart is full. Please check out or clear your shopping cart.",
      });
      return;
    }

    console.log(productId, userId)

    // Add to cart
    await knex("shopping_cart").insert({
      product_option_id: productId,
      member_id: userId,
      quantity: 1,
    });

     res.status(200).json({ message: "Added to shopping cart successfully" });
     return;

  } catch (err) {
    console.error(err);
     res.status(500).json({ message: "An error occurred while adding to cart" });
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
      .from("product_option")
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
  const product_id = data.product.product_option_id;
 
  try {
    await knex
    .from("shopping_cart")
    .where("product_option_id", product_id)
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
        
      })
      return;
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
    const state = 'Pending';

    console.log("userId =", userId);
    console.log("totalPrice =", totalPrice);
    console.log("state =", state);
  

    
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
      const product_id = shoppingCartResult.products_id;
      const quantity = shoppingCartResult.quantity;
      const product_price = shoppingCartResult.product_price;
      const subtotal =
        shoppingCartResult.quantity * shoppingCartResult.product_price;

      console.log("orderId =", orderId);
      console.log("productName =", productName);
      console.log("product_id =", product_id);
      console.log("quantity =", quantity);
      console.log("product_price =", product_price);
      console.log("subtotal =", subtotal);


      //Check stock
      const checkStockQuery = await knex
        .select("product_quantity")
        .from("product_option")
        .where("id", product_id);
      
      const currentStock = checkStockQuery[0].product_quantity;

      console.log("currentStock =", currentStock);

      if (currentStock < quantity) {
        res.status(400).json({ message: `'${productName}'. Available: ${currentStock}, Requested: ${quantity}` })
        return;
      }

      //扣product table內的庫存
      await knex
        .from("product_option")
        .where("id", product_id)
        .decrement("product_quantity", quantity);

      //更新order details
      await knex
      .from("order_details")
      .insert({
        order_id: orderId,
        product_id: product_id,
        quantity: quantity,
        product_price: product_price,
        subtotal: subtotal,
      });
    }

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

