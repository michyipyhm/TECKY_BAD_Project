import express, { Request, Response } from "express";
import { knex } from "../main";

export const productsRoutes = express.Router();

productsRoutes.get("/products", getProducts);
// productsRoutes.get("/products", filterProducts);

async function getProducts(req: Request, res: Response) {
  try {
    const product_info_result = await knex
      .select(
        "product_image.image_path",
        "category_name as product_type",
        "category_type",
        "model.name as model_name",
        "color.name as color_name",
        "products.product_name",
        "products.product_price",
        "products.product_quantity"
      )
      .from("product_option As po")
      .join("products", "products.id", "po.products_id")
      .join("color", "color.id", "po.color_id")
      .join("model", "model.id", "po.model_id")
      .join("category", "category.id", "category_id")
      .join("product_image", "products.id", "product_image.product_id")
      .orderBy("po.created_at", "desc");

    res.json(
      product_info_result.map((row: any) => ({
        id: row.product_id,
        product_name: row.product_name,
        product_price: row.product_price,
        image_path: row.image_path,
        product_id: row.product_id,
        product_quantity: row.product_quantity,
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving the product information.",
    });
  }
}


