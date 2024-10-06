import express, { Request, Response, Router } from "express";
import { knex } from "../main";

export const shoppingCartRouter = express();

shoppingCartRouter.get("/shoppingcart", getAllItems);

async function getAllItems(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json();
    return;
  }

  try {
    let queryResult = await knex("products")
      .join("category", "products.category_id", "=", "category.products.category_id")
      .join("product_option", "products.product_id", "=", "Product_option.products_id")
      .join("table2", "products.id", "=", "table2.table1_id")
      .join("table2", "products.id", "=", "table2.table1_id")
      .join("table2", "products.id", "=", "table2.table1_id")
      .select("*");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching shopping cart");
  }

//   try {
//     let queryResult = await pgClient.query(`select * from shopping_cart 
//               join product on product.id = shopping_cart.product_id 
//               join product_image on product_image.product_id = product.id 
//               join origin on origin.id = product.origin_id 
//               join format on format.id = product.format_id
//               where member_id =${userId};`);
//     let data = queryResult.rows;
//     // console.log(data)
//     let totalPriceQueryResult =
//       await pgClient.query(`select sum(product_price * quantity) as total from shopping_cart 
//   join product on product.id = shopping_cart.product_id   
//   where member_id =${userId}; `);
//     let totalPrice = totalPriceQueryResult.rows[0];
//     res.status(200).json({ data, totalPrice });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching shopping cart");
//   }
}
