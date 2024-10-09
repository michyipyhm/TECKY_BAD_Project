import express, { Request, Response } from "express";
import { knex } from "../main";

export const productsRoutes = express.Router();

productsRoutes.get("/products", getProducts);
// productsRoutes.get("/filterProducts", filterProducts);

async function getProducts(req: Request, res: Response) {
  const { productType , categoryType } = req.query;
  // const { category_type } = req.query;
  try {
    const product_info_result = knex
      .select(
        "products.id as product_id",
        "product_image.image_path",
        "category_name as product_type",
        "category_type as category_type",
        "model.name as model_name",
        "color.name as color_name",
        "products.product_name",
        "products.product_price",
        "product_quantity"
      )
      .from("product_option As po")
      .join("products", "products.id", "po.products_id")
      .join("color", "color.id", "po.color_id")
      .join("model", "model.id", "po.model_id")
      .join("category", "category.id", "category_id")
      .join("product_image", "products.id", "product_image.product_id")
      .orderBy("po.created_at", "desc");
    if (productType) {
      product_info_result.where("category_name", productType);
    }
    // if(categoryType)  {
    //   product_info_result.where("category_type",categoryType)
    // }

    const results = await product_info_result;
    res.json(
      results.map((row: any) => ({
        id: row.product_id,
        product_name: row.product_name,
        product_price: row.product_price,
        image_path: row.image_path,
        product_id: row.product_id,
        product_type: row.product_type,
        product_quantity: row.product_quantity,
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving the product information.",
    });
  }
}
